"use client";

import { useRef, useEffect } from "react";

type ListingMapProps = {
  lat: number;
  lng: number;
  closestBusStopName?: string | null;
  closestBusStopLat?: number | null;
  closestBusStopLng?: number | null;
  /** Destination campus coordinates. If provided, draws a dashed route line. */
  campusLat?: number;
  campusLng?: number;
  campusLabel?: string;
  /** GeoJSON MultiLineString coordinates from Geoapify routing API.
   *  When provided, draws the real road-following route instead of a straight line. */
  routeGeometry?: number[][][] | null;
};

export function ListingMap({
  lat,
  lng,
  closestBusStopName,
  closestBusStopLat,
  closestBusStopLng,
  campusLat,
  campusLng,
  campusLabel,
  routeGeometry,
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

      const map = L.default.map(containerRef.current).setView([lat, lng], 13);
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      /* ---- icons ---- */
      const listingIcon = L.default.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      /* ---- listing marker ---- */
      L.default
        .marker([lat, lng], { icon: listingIcon })
        .addTo(map)
        .bindPopup("Listing location");

      /* ---- bus stop marker (orange circle) ---- */
      const hasBusStop =
        closestBusStopLat != null &&
        closestBusStopLng != null &&
        typeof closestBusStopLat === "number" &&
        typeof closestBusStopLng === "number";

      if (hasBusStop) {
        L.default
          .circleMarker([closestBusStopLat!, closestBusStopLng!], {
            radius: 7,
            color: "#d97706",
            fillColor: "#fbbf24",
            fillOpacity: 0.9,
            weight: 2,
          })
          .addTo(map)
          .bindPopup(closestBusStopName ?? "Closest bus stop");
      }

      /* ---- campus marker + dashed route line ---- */
      if (campusLat != null && campusLng != null) {
        // Campus marker (red circle)
        L.default
          .circleMarker([campusLat, campusLng], {
            radius: 9,
            color: "#dc2626",
            fillColor: "#ef4444",
            fillOpacity: 0.9,
            weight: 2,
          })
          .addTo(map)
          .bindPopup(campusLabel ?? "Campus");

        // Draw route: prefer real road geometry, fall back to straight line
        if (routeGeometry && routeGeometry.length > 0) {
          // Geoapify returns MultiLineString coords as [lng, lat, …elevation]
          // Leaflet expects [lat, lng], so we swap each coordinate pair.
          const allRoutePoints: [number, number][] = [];
          for (const lineCoords of routeGeometry) {
            const latLngs: [number, number][] = lineCoords.map(
              (coord) => [coord[1], coord[0]] as [number, number]
            );
            allRoutePoints.push(...latLngs);

            L.default
              .polyline(latLngs, {
                color: "#2563eb",
                weight: 4,
                opacity: 0.8,
              })
              .addTo(map);
          }

          // Fit bounds to the real route geometry
          const bounds = L.default.latLngBounds(allRoutePoints);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
          }
        } else {
          // Fallback: straight dashed line when no geometry available
          const waypoints: [number, number][] = [[lat, lng]];
          if (hasBusStop) {
            waypoints.push([closestBusStopLat!, closestBusStopLng!]);
          }
          waypoints.push([campusLat, campusLng]);

          L.default
            .polyline(waypoints, {
              color: "#2563eb",
              weight: 4,
              opacity: 0.7,
              dashArray: "10, 8",
            })
            .addTo(map);

          const allPoints: [number, number][] = [[lat, lng], [campusLat, campusLng]];
          if (hasBusStop) {
            allPoints.push([closestBusStopLat!, closestBusStopLng!]);
          }
          const bounds = L.default.latLngBounds(allPoints);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
          }
        }
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
  }, [
    lat,
    lng,
    closestBusStopName,
    closestBusStopLat,
    closestBusStopLng,
    campusLat,
    campusLng,
    campusLabel,
    routeGeometry,
  ]);

  return (
    <div
      ref={containerRef}
      className="h-72 w-full rounded-lg border border-gray-200 bg-gray-100"
      aria-label="Map showing listing location and transit route to campus"
    />
  );
}
