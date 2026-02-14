import Link from "next/link";
import type { Listing } from "@/data/listings";
import { ListingCard } from "./ListingCard";

type ResultsListProps = {
  listings: Listing[];
  campus: "keele" | "markham";
};

export function ResultsList({ listings, campus }: ResultsListProps) {
  if (listings.length === 0) {
    return (
      <p className="animate-fade-in-up rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600 opacity-0">
        No listings found within that time. Try increasing the max time to
        campus.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, index) => (
        <li
          key={listing.id}
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: `${300 + index * 80}ms` }}
        >
          <Link href={`/listings/${listing.id}`} className="block h-full">
            <ListingCard listing={listing} campus={campus} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
