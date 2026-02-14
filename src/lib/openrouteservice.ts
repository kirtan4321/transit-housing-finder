/**
 * OpenRouteService API client (server-side only).
 * Directions: duration between two points (driving-car profile).
 * POIs: nearest bus stop to a point (category 588 = bus_stop).
 */

import { KEELE_CAMPUS, MARKHAM_CAMPUS } from "./constants";

const ORS_BASE = "https://api.openrouteservice.org";

function getHeaders(): HeadersInit | null {
  const key = process.env.OPENROUTESERVICE_API_KEY;
  if (!key) return null;
  return {
    Authorization: key,
    "Content-Type": "application/json",
  };
}

/** Get route duration in seconds. Coordinates [lng, lat]. */
export async function getDrivingDuration(
  from: [number, number],
  to: [number, number]
): Promise<number | null> {
  const headers = getHeaders();
  if (!headers) return null;
  try {
    const res = await fetch(`${ORS_BASE}/v2/directions/driving-car/json`, {
      method: "POST",
      headers,
      body: JSON.stringify({ coordinates: [from, to] }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      routes?: Array<{ summary?: { duration?: number } }>;
    };
    const duration = data.routes?.[0]?.summary?.duration;
    return typeof duration === "number" ? duration : null;
  } catch {
    return null;
  }
}

/** GeoJSON Feature for a POI */
interface POIFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties?: { name?: string; [k: string]: unknown };
}

/** Find nearest bus stop (category 588) to a point. Returns name and coords or null. */
export async function getNearestBusStop(
  lng: number,
  lat: number,
  bufferMeters = 800
): Promise<{ name: string; lng: number; lat: number } | null> {
  const headers = getHeaders();
  if (!headers) return null;
  try {
    const res = await fetch(`${ORS_BASE}/pois`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        request: "pois",
        geometry: {
          geojson: { type: "Point", coordinates: [lng, lat] },
          buffer: bufferMeters,
        },
        sortby: "distance",
        limit: 5,
        filters: {
          category_ids: [588],
        },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: POIFeature[];
    };
    const features = data.features ?? [];
    if (features.length === 0) return null;
    // Sort by distance to point (simple 2D distance)
    const [x, y] = [lng, lat];
    features.sort((a, b) => {
      const [ax, ay] = a.geometry.coordinates;
      const [bx, by] = b.geometry.coordinates;
      const da = (ax - x) ** 2 + (ay - y) ** 2;
      const db = (bx - x) ** 2 + (by - y) ** 2;
      return da - db;
    });
    const nearest = features[0];
    const [nlng, nlat] = nearest.geometry.coordinates;
    const name =
      nearest.properties?.name ?? `Bus stop (${nlng.toFixed(4)}, ${nlat.toFixed(4)})`;
    return { name, lng: nlng, lat: nlat };
  } catch {
    return null;
  }
}

export type TravelData = {
  minutes_to_keele: number;
  minutes_to_markham: number;
  closest_bus_stop: string | null;
  closest_bus_stop_lat: number | null;
  closest_bus_stop_lng: number | null;
};

/** Get travel data for a listing by coordinates. */
export async function getTravelData(
  lat: number,
  lng: number
): Promise<TravelData> {
  const [keeleDuration, markhamDuration, busStop] = await Promise.all([
    getDrivingDuration([lng, lat], [KEELE_CAMPUS.lng, KEELE_CAMPUS.lat]),
    getDrivingDuration([lng, lat], [MARKHAM_CAMPUS.lng, MARKHAM_CAMPUS.lat]),
    getNearestBusStop(lng, lat),
  ]);

  const secToMin = (s: number | null) =>
    s != null ? Math.round(s / 60) : 999;

  return {
    minutes_to_keele: secToMin(keeleDuration),
    minutes_to_markham: secToMin(markhamDuration),
    closest_bus_stop: busStop?.name ?? null,
    closest_bus_stop_lat: busStop?.lat ?? null,
    closest_bus_stop_lng: busStop?.lng ?? null,
  };
}
