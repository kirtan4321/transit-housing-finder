"use client";

import { useRef, useEffect } from "react";

type ListingMapProps = {
  lat: number;
  lng: number;
  closestBusStopName?: string | null;
  closestBusStopLat?: number | null;
  closestBusStopLng?: number | null;
};

export function ListingMap({
  lat,
  lng,
  closestBusStopName,
  closestBusStopLat,
  closestBusStopLng,
}: ListingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.default.map(containerRef.current).setView([lat, lng], 14);
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const defaultIcon = L.default.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      L.default.marker([lat, lng], { icon: defaultIcon })
        .addTo(map)
        .bindPopup("Listing");

      if (
        closestBusStopLat != null &&
        closestBusStopLng != null &&
        typeof closestBusStopLat === "number" &&
        typeof closestBusStopLng === "number"
      ) {
        L.default.marker([closestBusStopLat, closestBusStopLng])
          .addTo(map)
          .bindPopup(closestBusStopName ?? "Closest bus stop");
      }

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, closestBusStopName, closestBusStopLat, closestBusStopLng]);

  return (
    <div
      ref={containerRef}
      className="h-64 w-full rounded-lg border border-gray-200 bg-gray-100"
      aria-label="Map showing listing location"
    />
  );
}
