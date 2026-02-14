"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CAMPUS_OPTIONS = [
  { value: "keele", label: "Keele Campus" },
  { value: "markham", label: "Markham Campus" },
  { value: "glendon", label: "Glendon Campus" },
] as const;

const MAX_MINUTES_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

const MAX_RENT_OPTIONS = [
  { value: "0", label: "Any price" },
  { value: "1500", label: "Under $1,500" },
  { value: "1700", label: "Under $1,700" },
  { value: "1800", label: "Under $1,800" },
  { value: "1900", label: "Under $1,900" },
  { value: "2000", label: "Under $2,000" },
  { value: "2100", label: "Under $2,100" },
];

const MIN_SAFETY_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "3.5", label: "3.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

const MIN_RELIABILITY_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "3.5", label: "3.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

type SearchFiltersProps = {
  campus: "keele" | "markham" | "glendon";
  maxMinutes: number;
  maxRent: number;
  minSafety: number;
  minReliability: number;
};

export function SearchFilters({
  campus,
  maxMinutes,
  maxRent,
  minSafety,
  minReliability,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        next.set(key, value);
      }
      router.push(`/search?${next.toString()}`);
    },
    [router, searchParams]
  );

  const selectClass =
    "rounded-md border-2 border-york-blue/30 bg-york-blue/5 px-3 py-2 text-gray-900 transition-colors focus:border-york-red focus:outline-none focus:ring-1 focus:ring-york-red";

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* Campus */}
      <div className="flex flex-col gap-2">
        <label htmlFor="search-campus" className="text-sm font-medium text-gray-700">
          Campus
        </label>
        <select
          id="search-campus"
          value={campus}
          onChange={(e) => updateParams({ campus: e.target.value })}
          className={selectClass}
        >
          {CAMPUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Max time */}
      <div className="flex flex-col gap-2">
        <label htmlFor="search-max" className="text-sm font-medium text-gray-700">
          Max time to campus
        </label>
        <select
          id="search-max"
          value={maxMinutes}
          onChange={(e) => updateParams({ max: e.target.value })}
          className={selectClass}
        >
          {MAX_MINUTES_OPTIONS.map((m) => (
            <option key={m} value={m}>
              Under {m} mins
            </option>
          ))}
        </select>
      </div>

      {/* Max rent */}
      <div className="flex flex-col gap-2">
        <label htmlFor="search-rent" className="text-sm font-medium text-gray-700">
          Max rent
        </label>
        <select
          id="search-rent"
          value={maxRent}
          onChange={(e) => updateParams({ rent: e.target.value })}
          className={selectClass}
        >
          {MAX_RENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Min safety */}
      <div className="flex flex-col gap-2">
        <label htmlFor="search-safety" className="text-sm font-medium text-gray-700">
          Min safety score
        </label>
        <select
          id="search-safety"
          value={minSafety}
          onChange={(e) => updateParams({ safety: e.target.value })}
          className={selectClass}
        >
          {MIN_SAFETY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Min reliability */}
      <div className="flex flex-col gap-2">
        <label htmlFor="search-reliability" className="text-sm font-medium text-gray-700">
          Min transit reliability
        </label>
        <select
          id="search-reliability"
          value={minReliability}
          onChange={(e) => updateParams({ reliability: e.target.value })}
          className={selectClass}
        >
          {MIN_RELIABILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
