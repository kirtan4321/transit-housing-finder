import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/data/listings";
import { ListingMap } from "@/components/ListingMap";

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
        className="mb-6 inline-block text-sm text-red-700 hover:underline"
      >
        ← Back to search
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{listing.address}</h1>
        <p className="text-gray-500">{listing.area_name}</p>
        <p className="mt-2 text-2xl font-semibold text-red-700">
          ${listing.rent.toLocaleString()}/mo
        </p>
      </div>

      {listing.lat != null && listing.lng != null && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <ListingMap
            lat={listing.lat}
            lng={listing.lng}
            closestBusStopName={listing.closest_bus_stop}
            closestBusStopLat={listing.closest_bus_stop_lat}
            closestBusStopLng={listing.closest_bus_stop_lng}
          />
        </section>
      )}

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Time to campus
        </h2>
        <p className="mb-2 text-sm text-gray-600">
          Commute time from listing to campus using public transit.
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>{listing.minutes_to_keele} min</strong> to Keele Campus
          </li>
          <li>
            <strong>{listing.minutes_to_markham} min</strong> to Markham Campus
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          {listing.primary_route_summary}
        </p>
      </section>

      {listing.closest_bus_stop && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Closest bus stop
          </h2>
          <p className="text-gray-700">{listing.closest_bus_stop}</p>
        </section>
      )}

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Safety score
        </h2>
        <p className="text-2xl font-semibold text-green-700">
          {listing.safety_score}/5
        </p>
        <p className="text-sm text-gray-600">{listing.safety_label}</p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
