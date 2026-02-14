import type { RouteGeometry } from "./geoapify";

/** Travel data for a listing (all from Geoapify). */
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
