import { Suspense } from "react";
import { getListings, type CampusSlug } from "@/data/listings";
import { SearchFilters } from "@/components/SearchFilters";
import { ResultsList } from "@/components/ResultsList";

type SearchPageProps = {
  searchParams: Promise<{
    campus?: string;
    max?: string;
    rent?: string;
    safety?: string;
    reliability?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const campus: CampusSlug =
    params.campus === "markham"
      ? "markham"
      : params.campus === "glendon"
        ? "glendon"
        : "keele";
  const maxMinutes = Math.min(
    60,
    Math.max(10, parseInt(params.max ?? "25", 10) || 25)
  );
  const maxRent = parseInt(params.rent ?? "0", 10) || 0;
  const minSafety = parseFloat(params.safety ?? "0") || 0;
  const minReliability = parseFloat(params.reliability ?? "0") || 0;

  let results = await getListings(campus, maxMinutes);

  // Apply additional filters
  if (maxRent > 0) {
    results = results.filter((l) => l.rent <= maxRent);
  }
  if (minSafety > 0) {
    results = results.filter((l) => l.safety_score >= minSafety);
  }
  if (minReliability > 0) {
    results = results.filter((l) => l.reliability_score >= minReliability);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1
        className="animate-fade-in-up mb-6 text-2xl font-bold text-gray-900 opacity-0"
        style={{ animationDelay: "0ms" }}
      >
        Search results
      </h1>
      <div
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: "150ms" }}
      >
        <Suspense
          fallback={
            <div className="mb-6 h-20 animate-pulse rounded bg-gray-100" />
          }
        >
          <SearchFilters
            campus={campus}
            maxMinutes={maxMinutes}
            maxRent={maxRent}
            minSafety={minSafety}
            minReliability={minReliability}
          />
        </Suspense>
      </div>
      <ResultsList listings={results} campus={campus} />
    </div>
  );
}
