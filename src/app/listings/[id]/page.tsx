import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/data/listings";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/search"
        className="animate-fade-in-up mb-6 inline-block text-sm text-york-red opacity-0 hover:underline"
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

      <section
        className="animate-fade-in-up mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Time to campus
        </h2>
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

      <section
        className="animate-fade-in-up mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
        style={{ animationDelay: "350ms" }}
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Safety score
        </h2>
        <p className="text-2xl font-semibold text-york-blue">
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
        <p className="text-2xl font-semibold text-york-blue">
          {listing.reliability_score}/5
        </p>
        <p className="text-sm text-gray-600">{listing.frequency_summary}</p>
      </section>
    </div>
  );
}
