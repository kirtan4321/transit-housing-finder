import { SearchByTime } from "@/components/SearchByTime";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Find housing by time to campus
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          For York University students at Keele & Markham. Search by transit
          time—not just distance—plus safety and reliability scores.
        </p>
        <SearchByTime />
      </section>
      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 font-semibold text-gray-900">Time-based search</h2>
          <p className="text-sm text-gray-600">
            Filter by &quot;under 25 mins&quot; to Keele or Markham so you know
            the real commute.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 font-semibold text-gray-900">
            Reliability & frequency
          </h2>
          <p className="text-sm text-gray-600">
            See how often buses and trains run and how reliable the route is.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
