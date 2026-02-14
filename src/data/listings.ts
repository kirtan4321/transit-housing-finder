import { getTravelData, type TravelData } from "@/lib/openrouteservice";
import { getCachedTravel, setCachedTravel } from "@/lib/travel-cache";

/** Sentinel for "API unavailable" so we can fall back to hardcoded minutes. */
const ORS_UNAVAILABLE_MINUTES = 999;

/** Base listing: only hardcoded fields. Travel fields are added by getTravelData. */
export type ListingBase = {
  id: string;
  address: string;
  area_name: string;
  rent: number;
  safety_score: number;
  safety_label: string;
  reliability_score: number;
  frequency_summary: string;
  primary_route_summary: string;
  lat: number | null;
  lng: number | null;
  /** Used when OpenRouteService is missing or fails so search still works. */
  fallback_minutes_to_keele: number;
  fallback_minutes_to_markham: number;
};

/** Full listing with dynamically computed travel data (OpenRouteService). */
export type Listing = ListingBase & {
  minutes_to_keele: number;
  minutes_to_markham: number;
  closest_bus_stop: string | null;
  closest_bus_stop_lat: number | null;
  closest_bus_stop_lng: number | null;
};

const listingsBase: ListingBase[] = [
  {
    id: "1",
    address: "4700 Keele St, North York",
    area_name: "York University Village",
    rent: 1850,
    safety_score: 4.2,
    safety_label: "Very safe",
    reliability_score: 4.5,
    frequency_summary: "TTC 196 every ~8 min",
    primary_route_summary: "TTC 196B to York University (direct)",
    lat: 43.7735,
    lng: -79.5019,
    fallback_minutes_to_keele: 8,
    fallback_minutes_to_markham: 52,
  },
  {
    id: "2",
    address: "1 Shoreham Dr, North York",
    area_name: "Downsview",
    rent: 1650,
    safety_score: 4.0,
    safety_label: "Safe",
    reliability_score: 4.0,
    frequency_summary: "TTC 106 every ~10 min",
    primary_route_summary: "TTC 106 to York University Station",
    lat: 43.77072,
    lng: -79.51172,
    fallback_minutes_to_keele: 12,
    fallback_minutes_to_markham: 48,
  },
  {
    id: "3",
    address: "3200 Dufferin St, North York",
    area_name: "Lawrence Manor",
    rent: 1750,
    safety_score: 4.3,
    safety_label: "Very safe",
    reliability_score: 4.2,
    frequency_summary: "TTC 96 every ~6 min",
    primary_route_summary: "TTC 96 to York University",
    lat: 43.71873,
    lng: -79.45633,
    fallback_minutes_to_keele: 18,
    fallback_minutes_to_markham: 45,
  },
  {
    id: "4",
    address: "2500 Steeles Ave W, Vaughan",
    area_name: "Concord",
    rent: 1900,
    safety_score: 4.5,
    safety_label: "Very safe",
    reliability_score: 4.0,
    frequency_summary: "YRT 20 every ~15 min",
    primary_route_summary: "YRT 20 to Pioneer Village Station, then subway to Keele",
    lat: 43.78196,
    lng: -79.49284,
    fallback_minutes_to_keele: 22,
    fallback_minutes_to_markham: 28,
  },
  {
    id: "5",
    address: "15 Library Lane, Markham",
    area_name: "Markham Centre",
    rent: 1950,
    safety_score: 4.6,
    safety_label: "Very safe",
    reliability_score: 4.2,
    frequency_summary: "YRT 1 every ~12 min",
    primary_route_summary: "YRT 1 to Markham Campus (direct)",
    lat: 43.77150,
    lng: -79.50341,
    fallback_minutes_to_keele: 55,
    fallback_minutes_to_markham: 12,
  },
  {
    id: "6",
    address: "7271 Kennedy Rd, Markham",
    area_name: "Milliken",
    rent: 1720,
    safety_score: 4.4,
    safety_label: "Very safe",
    reliability_score: 3.8,
    frequency_summary: "YRT 24 every ~15 min",
    primary_route_summary: "YRT 24 to Markham Campus",
    lat: 43.8321,
    lng: -79.2687,
    fallback_minutes_to_keele: 48,
    fallback_minutes_to_markham: 18,
  },
  {
    id: "7",
    address: "550 Wilson Ave, North York",
    area_name: "Bathurst Manor",
    rent: 1680,
    safety_score: 4.1,
    safety_label: "Safe",
    reliability_score: 4.3,
    frequency_summary: "TTC 96 every ~6 min",
    primary_route_summary: "TTC 96 to York University",
    lat: 43.7589,
    lng: -79.4412,
    fallback_minutes_to_keele: 20,
    fallback_minutes_to_markham: 42,
  },
  {
    id: "8",
    address: "100 Borough Dr, Scarborough",
    area_name: "Scarborough Town Centre",
    rent: 1620,
    safety_score: 3.9,
    safety_label: "Generally safe",
    reliability_score: 3.9,
    frequency_summary: "TTC 95 every ~8 min",
    primary_route_summary: "TTC 95 to York University",
    lat: 43.7731,
    lng: -79.2542,
    fallback_minutes_to_keele: 38,
    fallback_minutes_to_markham: 25,
  },
  {
    id: "9",
    address: "5000 Yonge St, North York",
    area_name: "North York Centre",
    rent: 2100,
    safety_score: 4.4,
    safety_label: "Very safe",
    reliability_score: 4.5,
    frequency_summary: "TTC Line 1 every ~3 min",
    primary_route_summary: "Subway to Sheppard West, TTC 196 to York",
    lat: 43.7672,
    lng: -79.4123,
    fallback_minutes_to_keele: 25,
    fallback_minutes_to_markham: 38,
  },
  {
    id: "10",
    address: "88 Copper Creek Dr, Markham",
    area_name: "Cornell",
    rent: 1880,
    safety_score: 4.5,
    safety_label: "Very safe",
    reliability_score: 4.0,
    frequency_summary: "YRT 522 every ~20 min",
    primary_route_summary: "YRT 522 to Markham Campus",
    lat: 43.8612,
    lng: -79.2234,
    fallback_minutes_to_keele: 52,
    fallback_minutes_to_markham: 15,
  },
];

export type CampusSlug = "keele" | "markham";

async function getTravelDataForListing(base: ListingBase): Promise<TravelData> {
  const cached = getCachedTravel(base.id);
  if (cached) return cached;

  const lat = base.lat ?? 0;
  const lng = base.lng ?? 0;
  const data = await getTravelData(lat, lng);
  setCachedTravel(base.id, data);
  return data;
}

function mergeListing(base: ListingBase, travel: TravelData): Listing {
  const useFallbackKeele = travel.minutes_to_keele === ORS_UNAVAILABLE_MINUTES;
  const useFallbackMarkham = travel.minutes_to_markham === ORS_UNAVAILABLE_MINUTES;
  return {
    ...base,
    minutes_to_keele: useFallbackKeele ? base.fallback_minutes_to_keele : travel.minutes_to_keele,
    minutes_to_markham: useFallbackMarkham ? base.fallback_minutes_to_markham : travel.minutes_to_markham,
    closest_bus_stop: travel.closest_bus_stop,
    closest_bus_stop_lat: travel.closest_bus_stop_lat,
    closest_bus_stop_lng: travel.closest_bus_stop_lng,
  };
}

/** Fetch all listings with travel data, then filter by campus and max minutes. */
export async function getListings(
  campus: CampusSlug,
  maxMinutes: number
): Promise<Listing[]> {
  const withTravel = await Promise.all(
    listingsBase.map(async (base) => {
      const travel = await getTravelDataForListing(base);
      return mergeListing(base, travel);
    })
  );
  if (campus === "keele") {
    return withTravel.filter((l) => l.minutes_to_keele <= maxMinutes);
  }
  return withTravel.filter((l) => l.minutes_to_markham <= maxMinutes);
}

/** Fetch a single listing by id with travel data. */
export async function getListing(id: string): Promise<Listing | undefined> {
  const base = listingsBase.find((l) => l.id === id);
  if (!base) return undefined;
  const travel = await getTravelDataForListing(base);
  return mergeListing(base, travel);
}
