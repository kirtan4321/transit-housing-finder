import type { Listing } from "@/data/listings";

type ListingCardProps = {
  listing: Listing;
  campus: "keele" | "markham";
};

export function ListingCard({ listing, campus }: ListingCardProps) {
  const minutes =
    campus === "keele" ? listing.minutes_to_keele : listing.minutes_to_markham;
  const campusLabel = campus === "keele" ? "Keele" : "Markham";

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-1 font-semibold text-gray-900">{listing.address}</h2>
      <p className="mb-2 text-sm text-gray-500">{listing.area_name}</p>
      <p className="mb-3 text-lg font-semibold text-york-red">
        ${listing.rent.toLocaleString()}/mo
      </p>
      <p className="mb-3 text-sm text-gray-700">
        <span className="font-medium">{minutes} min</span> to {campusLabel}
      </p>
      <div className="mt-auto flex flex-wrap gap-2">
        <span
          className="inline-flex items-center rounded-full bg-york-blue/15 px-2.5 py-0.5 text-xs font-medium text-york-blue"
          title={`Safety: ${listing.safety_label}`}
        >
          Safety {listing.safety_score}/5
        </span>
        <span
          className="inline-flex items-center rounded-full bg-york-blue/20 px-2.5 py-0.5 text-xs font-medium text-york-blue"
          title={listing.frequency_summary}
        >
          Rel. {listing.reliability_score}/5
        </span>
      </div>
    </article>
  );
}
