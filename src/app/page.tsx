import { SearchByTime } from "@/components/SearchByTime";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <section className="mb-12 text-center">
        <h1
          className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 opacity-0 sm:text-4xl"
          style={{ animationDelay: "0ms" }}
        >
          Find housing by time to campus
        </h1>
        <p
          className="animate-fade-in-up mb-8 text-lg text-gray-600 opacity-0"
          style={{ animationDelay: "120ms" }}
        >
          For York University students at Keele & Markham. Search by transit
          time—not just distance—plus safety and reliability scores.
        </p>
        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "240ms" }}
        >
          <SearchByTime />
        </div>
      </section>
      <section className="grid gap-6 sm:grid-cols-3">
        <div
          className="animate-fade-in-up rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="mb-2 font-semibold text-gray-900">Time-based search</h2>
          <p className="text-sm text-gray-600">
            Filter by &quot;under 25 mins&quot; to Keele or Markham so you know
            the real commute.
          </p>
        </div>
        <div
          className="animate-fade-in-up rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
          style={{ animationDelay: "700ms" }}
        >
          <h2 className="mb-2 font-semibold text-gray-900">
            Reliability & frequency
          </h2>
          <p className="text-sm text-gray-600">
            See how often buses and trains run and how reliable the route is.
          </p>
        </div>
        <div
          className="animate-fade-in-up rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-0"
          style={{ animationDelay: "1100ms" }}
        >
          <h2 className="mb-2 font-semibold text-gray-900">Safety score</h2>
          <p className="text-sm text-gray-600">
            Area safety ratings to help international students assess
            neighborhoods.
          </p>
        </div>
      </section>
    </div>
  );
}
