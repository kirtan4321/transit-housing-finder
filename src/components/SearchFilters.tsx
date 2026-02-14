"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CAMPUS_OPTIONS = [
  { value: "keele", label: "Keele Campus" },
  { value: "markham", label: "Markham Campus" },
] as const;

const MAX_MINUTES_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

type SearchFiltersProps = {
  campus: "keele" | "markham";
  maxMinutes: number;
};

export function SearchFilters({ campus, maxMinutes }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (newCampus: string, newMax: number) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("campus", newCampus);
      next.set("max", String(newMax));
      router.push(`/search?${next.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
        <label htmlFor="search-campus" className="text-sm font-medium text-gray-700">
          Campus
        </label>
        <select
          id="search-campus"
          value={campus}
          onChange={(e) => updateParams(e.target.value, maxMinutes)}
          className="rounded-md border-2 border-york-blue/30 bg-york-blue/5 px-3 py-2 text-gray-900 transition-colors focus:border-york-red focus:outline-none focus:ring-1 focus:ring-york-red"
        >
          {CAMPUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
        <label htmlFor="search-max" className="text-sm font-medium text-gray-700">
          Max time to campus
        </label>
        <select
          id="search-max"
          value={maxMinutes}
          onChange={(e) => updateParams(campus, Number(e.target.value))}
          className="rounded-md border-2 border-york-blue/30 bg-york-blue/5 px-3 py-2 text-gray-900 transition-colors focus:border-york-red focus:outline-none focus:ring-1 focus:ring-york-red"
        >
          {MAX_MINUTES_OPTIONS.map((m) => (
            <option key={m} value={m}>
              Under {m} mins
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
