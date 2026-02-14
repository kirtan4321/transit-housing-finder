/**
 * Geoapify API client (server-side only).
 *
 * Routing API  – transit route: time, bus/train names, route geometry.
 * Places API   – nearest bus stop by category public_transport.bus.
 */

import { KEELE_CAMPUS, MARKHAM_CAMPUS, GLENDON_CAMPUS } from "./constants";

const ROUTING_BASE = "https://api.geoapify.com/v1/routing";
const PLACES_BASE = "https://api.geoapify.com/v2/places";

function getApiKey(): string | null {
  return process.env.GEOAPIFY_API_KEY ?? null;
}

/* ---------- types ---------- */

/** GeoJSON MultiLineString coordinates. */
export type RouteGeometry = number[][][] | null;

export type GeoapifyTransitRoute = {
  timeSeconds: number;
  timeMinutes: number;
  transitLineNames: string[];
  geometry: RouteGeometry;
};

export type NearestBusStop = {
  name: string;
  lat: number;
  lng: number;
  distanceMeters: number;
};

/* ---------- routing ---------- */

interface GeoapifyLeg {
  time?: number;
  distance?: number;
  steps?: Array<{
    from_index?: number;
    to_index?: number;
    instruction?: { text?: string; type?: string };
  }>;
}

interface GeoapifyGeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "MultiLineString";
    coordinates: number[][][];
  };
  properties: {
    mode?: string;
    time?: number;
    distance?: number;
    legs?: GeoapifyLeg[];
    [k: string]: unknown;
  };
}

interface GeoapifyGeoJSONResponse {
  type: "FeatureCollection";
  features?: GeoapifyGeoJSONFeature[];
}

/** Convert ALL-CAPS or mixed text to Title Case, keeping small words lowercase. */
function titleCase(s: string): string {
  const small = new Set(["and", "or", "to", "of", "the", "in", "at", "for", "via"]);
  return s
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((word, i) => {
      if (/^[\s-]+$/.test(word)) return word;
      if (i > 0 && small.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

/**
 * Turn a verbose Geoapify transit instruction into a short, readable label.
 *
 * "Take the 1 toward LINE 1 (YONGE-UNIVERSITY) TOWARDS VAUGHAN … (26 stops)"
 *   → "Line 1 (Yonge-University)"
 *
 * "Take the 124 toward EAST - 124 SUNNYBROOK TOWARDS SUNNYBROOK HOSPITAL. (9 stops)"
 *   → "Bus 124 Sunnybrook"
 *
 * "Transfer to take the green toward McCowan Road - NB. (1 stop)"
 *   → "Green Line"
 */
function parseTransitLabel(text: string): string | null {
  // Pattern: "[Transfer to] take the <route> toward <direction>[. (<N> stop(s))]"
  const m = text.match(
    /[Tt]ake\s+the\s+(.+?)\s+toward\s+(.+?)(?:\.\s*\(\d+\s+stops?\))?\s*\)?\s*$/
  );
  if (!m) return null;

  const routeId = m[1].trim();
  let direction = m[2].trim();

  // Strip "TOWARDS <terminal station>" suffix
  direction = direction.replace(/\s+TOWARDS\s+.*/i, "");
  // Strip trailing direction codes like "- NB", "- MO", "- EB", etc.
  direction = direction
    .replace(/\s*-\s*(?:NB|SB|EB|WB|MO|N|S|E|W)\.?\s*$/i, "")
    .replace(/\.$/, "")
    .trim();

  // Named subway / metro line → "Line 1 (Yonge-University)"
  const lineMatch = direction.match(/LINE\s+(\S+)\s*\(([^)]+)\)/i);
  if (lineMatch) {
    return `Line ${lineMatch[1]} (${titleCase(lineMatch[2])})`;
  }

  // Numeric bus route → "Bus 124 Sunnybrook"
  if (/^\d+$/.test(routeId)) {
    // Remove repeated route number / cardinal prefix from direction
    direction = direction
      .replace(new RegExp(`^(?:EAST|WEST|NORTH|SOUTH)\\s*-\\s*${routeId}\\s*`, "i"), "")
      .replace(new RegExp(`^${routeId}\\s*`, ""), "")
      .replace(/^-\s*/, "")
      .trim();
    const short = titleCase(direction);
    return short ? `Bus ${routeId} ${short}` : `Bus ${routeId}`;
  }

  // Named route (e.g. "green" for a streetcar / LRT)
  return `${titleCase(routeId)} Line`;
}

function extractTransitLineNames(legs: GeoapifyLeg[]): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const leg of legs) {
    for (const step of leg.steps ?? []) {
      const type = step.instruction?.type ?? "";
      if (
        ![
          "Transit",
          "TransitRemainOn",
          "TransitTransfer",
          "TransitConnectionStart",
          "TransitConnectionTransfer",
        ].includes(type)
      )
        continue;

      const text = step.instruction?.text ?? "";
      const label = parseTransitLabel(text);
      if (label && !seen.has(label)) {
        seen.add(label);
        names.push(label);
      }
    }
  }
  return names;
}

async function fetchRoute(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: "transit" | "approximated_transit",
  apiKey: string
): Promise<GeoapifyTransitRoute | null> {
  const waypoints = `${fromLat},${fromLng}|${toLat},${toLng}`;
  const url = `${ROUTING_BASE}?waypoints=${encodeURIComponent(waypoints)}&mode=${mode}&details=instruction_details&apiKey=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[Geoapify] Routing ${mode} HTTP ${res.status}: ${res.statusText}`);
    return null;
  }

  const data = (await res.json()) as GeoapifyGeoJSONResponse;
  const feature = data.features?.[0];
  if (!feature?.geometry?.coordinates?.length) {
    console.error(`[Geoapify] Routing ${mode}: no feature or empty geometry`);
    return null;
  }

  const timeSeconds = feature.properties?.time ?? 0;
  const legs = feature.properties?.legs ?? [];
  const transitLineNames = extractTransitLineNames(legs);

  return {
    timeSeconds,
    timeMinutes: timeSeconds > 0 ? Math.round(timeSeconds / 60) : 0,
    transitLineNames,
    geometry: feature.geometry.coordinates,
  };
}

/**
 * Get transit route. Tries `transit` mode first, falls back to `approximated_transit`.
 */
export async function getTransitRoute(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<GeoapifyTransitRoute | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[Geoapify] GEOAPIFY_API_KEY is not set");
    return null;
  }

  try {
    const route = await fetchRoute(fromLat, fromLng, toLat, toLng, "transit", apiKey);
    if (route && route.timeSeconds > 0) return route;
  } catch (e) {
    console.error("[Geoapify] transit mode error:", e);
  }

  try {
    const route = await fetchRoute(fromLat, fromLng, toLat, toLng, "approximated_transit", apiKey);
    if (route) return route;
  } catch (e) {
    console.error("[Geoapify] approximated_transit mode error:", e);
  }

  return null;
}

/* ---------- places (nearest bus stop) ---------- */

interface GeoapifyPlaceFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    name?: string;
    formatted?: string;
    distance?: number;
    lat?: number;
    lon?: number;
    [k: string]: unknown;
  };
}

interface GeoapifyPlacesResponse {
  type: "FeatureCollection";
  features?: GeoapifyPlaceFeature[];
}

/**
 * Find the nearest bus stop using Geoapify Places API (same key as Routing).
 */
export async function getNearestBusStop(
  lat: number,
  lng: number,
  radiusMeters = 800
): Promise<NearestBusStop | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const filter = `circle:${lng},${lat},${radiusMeters}`;
  const bias = `proximity:${lng},${lat}`;
  const url = `${PLACES_BASE}?categories=public_transport.bus,public_transport&filter=${filter}&bias=${bias}&limit=1&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as GeoapifyPlacesResponse;
    const feature = data.features?.[0];
    if (!feature) return null;

    const props = feature.properties;
    const name = props.name || props.formatted || "Bus stop";
    const stopLat = props.lat ?? feature.geometry.coordinates[1];
    const stopLng = props.lon ?? feature.geometry.coordinates[0];
    const distanceMeters = props.distance ?? 0;

    return { name, lat: stopLat, lng: stopLng, distanceMeters };
  } catch {
    return null;
  }
}

/* ---------- combined ---------- */
// Why do we have the same function here as the travel-types.ts file?
export type TravelData = {
  minutes_to_keele: number;
  minutes_to_markham: number;
  minutes_to_glendon: number;

  transit_lines_to_keele: string[];
  transit_lines_to_markham: string[];
  transit_lines_to_glendon: string[];

  route_geometry_to_keele: RouteGeometry;
  route_geometry_to_markham: RouteGeometry;
  route_geometry_to_glendon: RouteGeometry;

  closest_bus_stop: string | null;
  closest_bus_stop_lat: number | null;
  closest_bus_stop_lng: number | null;
  closest_bus_stop_distance_m: number | null;
};

/** Sentinel for "API unavailable". */
export const GEOAPIFY_UNAVAILABLE_MINUTES = 999;

/**
 * Fetch all travel data for a listing coordinate.
 */
export async function getTravelDataForCoords(
  lat: number,
  lng: number
): Promise<TravelData> {
  const [routeToKeele, routeToMarkham, routeToGlendon, busStop] = await Promise.all([
    getTransitRoute(lat, lng, KEELE_CAMPUS.lat, KEELE_CAMPUS.lng),
    getTransitRoute(lat, lng, MARKHAM_CAMPUS.lat, MARKHAM_CAMPUS.lng),
    getTransitRoute(lat, lng, GLENDON_CAMPUS.lat, GLENDON_CAMPUS.lng),
    getNearestBusStop(lat, lng),
  ]);

  return {
    // get the minutes to
    minutes_to_keele: routeToKeele?.timeMinutes ?? GEOAPIFY_UNAVAILABLE_MINUTES,
    minutes_to_markham: routeToMarkham?.timeMinutes ?? GEOAPIFY_UNAVAILABLE_MINUTES,
    minutes_to_glendon: routeToGlendon?.timeMinutes ?? GEOAPIFY_UNAVAILABLE_MINUTES,
    // populate the transit lines for each campus in an empty list 
    transit_lines_to_keele: routeToKeele?.transitLineNames ?? [],
    transit_lines_to_markham: routeToMarkham?.transitLineNames ?? [],
    transit_lines_to_glendon: routeToGlendon?.transitLineNames ?? [],
    // populate the route geometry for each campus
    route_geometry_to_keele: routeToKeele?.geometry ?? null,
    route_geometry_to_markham: routeToMarkham?.geometry ?? null,
    route_geometry_to_glendon: routeToGlendon?.geometry ?? null,

    closest_bus_stop: busStop?.name ?? null,
    closest_bus_stop_lat: busStop?.lat ?? null,
    closest_bus_stop_lng: busStop?.lng ?? null,
    closest_bus_stop_distance_m: busStop?.distanceMeters ?? null,
  };
}
