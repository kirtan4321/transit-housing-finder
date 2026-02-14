import type { TravelData } from "./openrouteservice";

const travelCache = new Map<string, TravelData>();

export function getCachedTravel(id: string): TravelData | undefined {
  return travelCache.get(id);
}

export function setCachedTravel(id: string, data: TravelData): void {
  travelCache.set(id, data);
}
