"use client";

import { useState } from "react";
import { ListingMap } from "./ListingMap";

const KEELE_CAMPUS = { lat: 43.7736, lng: -79.5019 };
const MARKHAM_CAMPUS = { lat: 43.8765, lng: -79.2665 };
const GLENDON_CAMPUS = { lat: 43.72829, lng: -79.37818 };

type ListingMapWithRouteProps = {
  lat: number;
  lng: number;
  closestBusStopName?: string | null;
  closestBusStopLat?: number | null;
  closestBusStopLng?: number | null;

  transitLinesToKeele: string[];
  transitLinesToMarkham: string[];
  transitLinesToGlendon: string[];

  minutesToKeele: number;
  minutesToMarkham: number;
  minutesToGlendon: number;
};

export function ListingMapWithRoute({
  lat,
  lng,
  closestBusStopName,
  closestBusStopLat,
  closestBusStopLng,
  transitLinesToKeele,
  transitLinesToMarkham,
  transitLinesToGlendon,
  minutesToKeele,
  minutesToMarkham,
  minutesToGlendon,
}: ListingMapWithRouteProps) {
  const [campus, setCampus] = useState<"keele" | "markham" | "glendon">("keele");

  const campusCoords = campus === "keele" ? KEELE_CAMPUS : campus === "markham" ? MARKHAM_CAMPUS : GLENDON_CAMPUS;
  const campusLabel = campus === "keele" ? "Keele Campus" : campus === "markham" ? "Markham Campus" : "Glendon Campus";
  const transitLines = campus === "keele" ? transitLinesToKeele : campus === "markham" ? transitLinesToMarkham : transitLinesToGlendon;
  const minutes = campus === "keele" ? minutesToKeele : campus === "markham" ? minutesToMarkham : minutesToGlendon;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Show route to:
        </label>
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value as "keele" | "markham" | "glendon")}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900"
        >
          <option value="keele">Keele Campus</option>
          <option value="markham">Markham Campus</option>
          <option value="glendon">Glendon Campus</option>
        </select>
        <span className="text-sm font-semibold text-gray-800">
          {minutes} min
        </span>
      </div>

      <ListingMap
        lat={lat}
        lng={lng}
        closestBusStopName={closestBusStopName}
        closestBusStopLat={closestBusStopLat}
        closestBusStopLng={closestBusStopLng}
        campusLat={campusCoords.lat}
        campusLng={campusCoords.lng}
        campusLabel={campusLabel}
      />

      {transitLines.length > 0 && (
        <p className="text-sm text-gray-600">
          <span className="font-medium">Transit:</span>{" "}
          {transitLines.join(" → ")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-blue-600 bg-blue-500" />
          Listing
        </span>
        {closestBusStopName && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-amber-600 bg-amber-400" />
            Bus stop
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-red-600 bg-red-500" />
          {campusLabel}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 border-t-2 border-dashed border-blue-600" />
          Transit route
        </span>
      </div>
    </div>
  );
}
