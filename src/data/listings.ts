export type Listing = {
  id: string;
  address: string;
  area_name: string;
  rent: number;
  minutes_to_keele: number;
  minutes_to_markham: number;
  safety_score: number;
  safety_label: string;
  reliability_score: number;
  frequency_summary: string;
  primary_route_summary: string;
  lat: number | null;
  lng: number | null;
};

export const listings: Listing[] = [
  {
    id: "1",
    address: "4700 Keele St, North York",
    area_name: "York University Village",
    rent: 1850,
    minutes_to_keele: 8,
    minutes_to_markham: 52,
    safety_score: 4.2,
    safety_label: "Very safe",
    reliability_score: 4.5,
    frequency_summary: "TTC 196 every ~8 min",
    primary_route_summary: "TTC 196B to York University (direct)",
    lat: 43.7735,
    lng: -79.5019,
  },
  {
    id: "2",
    address: "1 Shoreham Dr, North York",
    area_name: "Downsview",
    rent: 1650,
    minutes_to_keele: 12,
    minutes_to_markham: 48,
    safety_score: 4.0,
    safety_label: "Safe",
    reliability_score: 4.0,
    frequency_summary: "TTC 106 every ~10 min",
    primary_route_summary: "TTC 106 to York University Station",
    lat: 43.7612,
    lng: -79.4801,
  },
  {
    id: "3",
    address: "3200 Dufferin St, North York",
    area_name: "Lawrence Manor",
    rent: 1750,
    minutes_to_keele: 18,
    minutes_to_markham: 45,
    safety_score: 4.3,
    safety_label: "Very safe",
    reliability_score: 4.2,
    frequency_summary: "TTC 96 every ~6 min",
    primary_route_summary: "TTC 96 to York University",
    lat: 43.7245,
    lng: -79.4521,
  },
  {
    id: "4",
    address: "2500 Steeles Ave W, Vaughan",
    area_name: "Concord",
    rent: 1900,
    minutes_to_keele: 22,
    minutes_to_markham: 28,
    safety_score: 4.5,
    safety_label: "Very safe",
    reliability_score: 4.0,
    frequency_summary: "YRT 20 every ~15 min",
    primary_route_summary: "YRT 20 to Pioneer Village Station, then subway to Keele",
    lat: 43.7945,
    lng: -79.5123,
  },
  {
    id: "5",
    address: "15 Library Lane, Markham",
    area_name: "Markham Centre",
    rent: 1950,
    minutes_to_keele: 55,
    minutes_to_markham: 12,
    safety_score: 4.6,
    safety_label: "Very safe",
    reliability_score: 4.2,
    frequency_summary: "YRT 1 every ~12 min",
    primary_route_summary: "YRT 1 to Markham Campus (direct)",
    lat: 43.8765,
    lng: -79.2665,
  },
  {
    id: "6",
    address: "7271 Kennedy Rd, Markham",
    area_name: "Milliken",
    rent: 1720,
    minutes_to_keele: 48,
    minutes_to_markham: 18,
    safety_score: 4.4,
    safety_label: "Very safe",
    reliability_score: 3.8,
    frequency_summary: "YRT 24 every ~15 min",
    primary_route_summary: "YRT 24 to Markham Campus",
    lat: 43.8321,
    lng: -79.2687,
  },
  {
    id: "7",
    address: "550 Wilson Ave, North York",
    area_name: "Bathurst Manor",
    rent: 1680,
    minutes_to_keele: 20,
    minutes_to_markham: 42,
    safety_score: 4.1,
    safety_label: "Safe",
    reliability_score: 4.3,
    frequency_summary: "TTC 96 every ~6 min",
    primary_route_summary: "TTC 96 to York University",
    lat: 43.7589,
    lng: -79.4412,
  },
  {
    id: "8",
    address: "100 Borough Dr, Scarborough",
    area_name: "Scarborough Town Centre",
    rent: 1620,
    minutes_to_keele: 38,
    minutes_to_markham: 25,
    safety_score: 3.9,
    safety_label: "Generally safe",
    reliability_score: 3.9,
    frequency_summary: "TTC 95 every ~8 min",
    primary_route_summary: "TTC 95 to York University",
    lat: 43.7731,
    lng: -79.2542,
  },
  {
    id: "9",
    address: "5000 Yonge St, North York",
    area_name: "North York Centre",
    rent: 2100,
    minutes_to_keele: 25,
    minutes_to_markham: 38,
    safety_score: 4.4,
    safety_label: "Very safe",
    reliability_score: 4.5,
    frequency_summary: "TTC Line 1 every ~3 min",
    primary_route_summary: "Subway to Sheppard West, TTC 196 to York",
    lat: 43.7672,
    lng: -79.4123,
  },
  {
    id: "10",
    address: "88 Copper Creek Dr, Markham",
    area_name: "Cornell",
    rent: 1880,
    minutes_to_keele: 52,
    minutes_to_markham: 15,
    safety_score: 4.5,
    safety_label: "Very safe",
    reliability_score: 4.0,
    frequency_summary: "YRT 522 every ~20 min",
    primary_route_summary: "YRT 522 to Markham Campus",
    lat: 43.8612,
    lng: -79.2234,
  },
];

export type CampusSlug = "keele" | "markham";

export function getListings(campus: CampusSlug, maxMinutes: number): Listing[] {
  if (campus === "keele") {
    return listings.filter((l) => l.minutes_to_keele <= maxMinutes);
  }
  return listings.filter((l) => l.minutes_to_markham <= maxMinutes);
}

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}
