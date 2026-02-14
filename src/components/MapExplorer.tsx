"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import type { ListingBase } from "@/data/listings";

type Campus = { name: string; lat: number; lng: number };

type Props = {
  listings: ListingBase[];
  campuses: Campus[];
};

export function MapExplorer({ listings, campuses }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<ListingBase | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Center on GTA area
      const map = L.default.map(containerRef.current).setView([43.77, -79.4], 11);
      L.default
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(map);

      // Red icon for campuses
      const redIcon = L.default.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Blue icon for houses
      const blueIcon = L.default.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Add campus pins (red)
      campuses.forEach((c) => {
        L.default
          .marker([c.lat, c.lng], { icon: redIcon })
          .addTo(map)
          .bindTooltip(c.name, { permanent: false, direction: "top" });
      });

      // Add house pins (blue)
      listings.forEach((listing) => {
        if (listing.lat == null || listing.lng == null) return;
        const marker = L.default
          .marker([listing.lat, listing.lng], { icon: blueIcon })
          .addTo(map);

        marker.on("click", () => {
          setSelected(listing);
        });

        marker.bindTooltip(listing.area_name, {
          permanent: false,
          direction: "top",
        });
      });

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-[calc(100vh-65px)] w-full">
      {/* Left sidebar - listing details */}
      {selected && (
        <div className="absolute left-0 top-0 z-[1000] h-full w-80 overflow-y-auto border-r border-gray-200 bg-white shadow-lg sm:w-96">
          <div className="p-5">
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </button>

            {/* Listing image placeholder */}
            <div className="mb-4 h-44 w-full overflow-hidden rounded-lg bg-gray-200">
              <img
                src="/living-room-1.jpg"
                alt="Listing"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Address & area */}
            <h2 className="text-lg font-bold text-gray-900">
              {selected.address}
            </h2>
            <p className="text-sm text-gray-500">{selected.area_name}</p>

            {/* Rent */}
            <p className="mt-3 text-2xl font-semibold text-red-700">
              ${selected.rent.toLocaleString()}/mo
            </p>

            {/* Info cards */}
            <div className="mt-5 space-y-3">
              {/* Safety */}
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Safety
                </p>
                <p className="text-lg font-semibold text-green-700">
                  {selected.safety_score}/5{" "}
                  <span className="text-sm font-normal text-gray-500">
                    — {selected.safety_label}
                  </span>
                </p>
              </div>

              {/* Transit reliability */}
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Transit Reliability
                </p>
                <p className="text-lg font-semibold text-blue-700">
                  {selected.reliability_score}/5
                </p>
                <p className="text-sm text-gray-500">
                  {selected.frequency_summary}
                </p>
              </div>

              {/* Route */}
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Primary Route
                </p>
                <p className="text-sm text-gray-700">
                  {selected.primary_route_summary}
                </p>
              </div>

              {/* Travel times */}
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Estimated Travel Time
                </p>
                <ul className="mt-1 space-y-1 text-sm text-gray-700">
                  <li>
                    <strong>{selected.fallback_minutes_to_keele} min</strong> to
                    Keele Campus
                  </li>
                  <li>
                    <strong>{selected.fallback_minutes_to_markham} min</strong>{" "}
                    to Markham Campus
                  </li>
                  <li>
                    <strong>{selected.fallback_minutes_to_glendon} min</strong>{" "}
                    to Glendon Campus
                  </li>
                </ul>
              </div>
            </div>

            {/* View details link */}
            <Link
              href={`/listings/${selected.id}`}
              className="mt-5 block w-full rounded-lg bg-red-700 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-red-800"
            >
              View Full Details
            </Link>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
