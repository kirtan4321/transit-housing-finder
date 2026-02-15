import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/data/listings";
import { ListingMapWithRoute } from "@/components/ListingMapWithRoute";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/search"
        className="animate-fade-in-up mb-6 inline-block text-sm text-red opacity-0-700 hover:underline"
        style={{ animationDelay: "0ms" }}
      >
        ← Back to search
      </Link>
      <div
        className="animate-fade-in-up mb-6 opacity-0"
        style={{ animationDelay: "100ms" }}
      >
        <h1 className="text-2xl font-bold text-gray-900">{listing.address}</h1>
        <p className="text-gray-500">{listing.area_name}</p>
        <p className="mt-2 text-2xl font-semibold text-red-700">
          ${listing.rent.toLocaleString()}/mo
        </p>
      </div>

      {listing.lat != null && listing.lng != null && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <ListingMapWithRoute
            lat={listing.lat}
            lng={listing.lng}
            closestBusStopName={listing.closest_bus_stop}
            closestBusStopLat={listing.closest_bus_stop_lat}
            closestBusStopLng={listing.closest_bus_stop_lng}

            transitLinesToKeele={listing.transit_lines_to_keele}
            transitLinesToMarkham={listing.transit_lines_to_markham}
            transitLinesToGlendon={listing.transit_lines_to_glendon}

            minutesToKeele={listing.minutes_to_keele}
            minutesToMarkham={listing.minutes_to_markham}
            minutesToGlendon={listing.minutes_to_glendon}

            routeGeometryToKeele={listing.route_geometry_to_keele}
            routeGeometryToMarkham={listing.route_geometry_to_markham}
            routeGeometryToGlendon={listing.route_geometry_to_glendon}
          />
        </section>
      )}

      <section
        className="animate-fade-in-up mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Time to campus
        </h2>
        <p className="mb-2 text-sm text-gray-600">
          Transit time from listing to campus (Geoapify).
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>{listing.minutes_to_keele} min</strong> to Keele Campus
            {listing.transit_lines_to_keele.length > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                ({listing.transit_lines_to_keele.join(", ")})
              </span>
            )}
          </li>
          <li>
            <strong>{listing.minutes_to_glendon} min</strong> to Glendon Campus
            {listing.transit_lines_to_glendon.length > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                ({listing.transit_lines_to_glendon.join(", ")})
              </span>
            )}
          </li>
          <li>
            <strong>{listing.minutes_to_markham} min</strong> to Markham Campus
            {listing.transit_lines_to_markham.length > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                ({listing.transit_lines_to_markham.join(", ")})
              </span>
            )}
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          {listing.primary_route_summary}
        </p>
      </section>

      {listing.closest_bus_stop && (
        <section
          className="animate-fade-in-up mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Closest bus stop
          </h2>
          <p className="text-gray-700 font-medium">{listing.closest_bus_stop}</p>
          {listing.closest_bus_stop_distance_m != null && (
            <p className="mt-1 text-sm text-gray-600">
              {listing.closest_bus_stop_distance_m < 1000
                ? `${Math.round(listing.closest_bus_stop_distance_m)} m away`
                : `${(listing.closest_bus_stop_distance_m / 1000).toFixed(1)} km away`}
              {" "}
              ({Math.round(listing.closest_bus_stop_distance_m / 80)} min walk)
            </p>
          )}
        </section>
      )}

      <section
        className="animate-fade-in-up mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
        style={{ animationDelay: "350ms" }}
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Safety score
        </h2>
        <p className="text-2xl font-semibold text-green-700">
          {listing.safety_score}/5
        </p>
        <p className="text-sm text-gray-600">{listing.safety_label}</p>
      </section>

      <section
        className="animate-fade-in-up rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
        style={{ animationDelay: "500ms" }}
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Transit reliability
        </h2>
        <p className="text-2xl font-semibold text-blue-700">
          {listing.reliability_score}/5
        </p>
        <p className="text-sm text-gray-600">{listing.frequency_summary}</p>
      </section>
    </div>
  );
}
