import Image from "next/image";
import type { Listing } from "@/data/listings";

const LISTING_IMAGES = [
  "/living-room-1.jpg",
  "/living-room-2.jpg",
  "/living-room-3.jpg",
  "/living-room-4.jpg",
];

/** Derive a short frequency label from the frequency_summary string. */
function getFrequencyLabel(summary: string): string {
  const match = summary.match(/every\s*~?\s*(\d+)/);
  if (!match) return summary;
  const interval = parseInt(match[1], 10);
  if (interval <= 10) return "Frequent Service";
  if (interval <= 15) return "Regular Service";
  return "Limited Service";
}

type ListingCardProps = {
  listing: Listing;
  campus: "keele" | "markham" | "glendon";
};

export function ListingCard({ listing, campus }: ListingCardProps) {
  const minutes =
    campus === "keele"
      ? listing.minutes_to_keele
      : campus === "markham"
        ? listing.minutes_to_markham
        : listing.minutes_to_glendon;
  const campusLabel =
    campus === "keele" ? "Keele" : campus === "markham" ? "Markham" : "Glendon";

  // Rotate among the 4 listing images based on the listing id
  const imageIndex = (parseInt(listing.id, 10) - 1) % LISTING_IMAGES.length;
  const imageSrc = LISTING_IMAGES[imageIndex >= 0 ? imageIndex : 0];

  const frequencyLabel = getFrequencyLabel(listing.frequency_summary);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99]">
      {/* Image with transit-time overlay */}
      <div className="relative h-48 w-full flex-shrink-0">
        <Image
          src={imageSrc}
          alt={listing.address}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-blue-500 px-3.5 py-1 text-sm font-semibold text-white shadow-lg">
          {minutes} mins to {campusLabel}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Price & rating row */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ${listing.rent.toLocaleString()} / month
          </p>
          <div className="flex items-center gap-1">
            <span className="text-lg text-amber-400">&#9733;</span>
            <span className="text-sm font-semibold text-gray-800">
              {listing.safety_score}/5
            </span>
          </div>
        </div>

        {/* Frequency badge */}
        <div className="mb-2">
          <span
            className="inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white"
            title={listing.frequency_summary}
          >
            {frequencyLabel}
          </span>
        </div>

        {/* Nearest stop */}
        {listing.closest_bus_stop && (
          <p className="mt-auto text-sm text-gray-600">
            Nearest Stop: {listing.closest_bus_stop}
          </p>
        )}
      </div>
    </article>
  );
}
