import Image from "next/image";
import { SearchByTime } from "@/components/SearchByTime";

const FEATURE_CARDS = [
  {
    image: "/time.jpeg",
    title: "Time-based search",
    description:
      'Filter by "under 25 mins" to Keele or Markham so you know the real commute.',
    delay: "300ms",
  },
  {
    image: "/reliability.jpg",
    title: "Reliability & frequency",
    description:
      "See how often buses and trains run and how reliable the route is.",
    delay: "700ms",
  },
  {
    image: "/safety.jpg",
    title: "Safety score",
    description:
      "Area safety ratings to help international students assess neighborhoods.",
    delay: "1100ms",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <section className="mb-12 text-center">
        <h1
          className="animate-fade-in-up mb-4 text-3xl font-bold text-york-red opacity-0 sm:text-4xl"
          style={{ animationDelay: "0ms" }}
        >
          Find housing by time to campus
        </h1>
        <p
          className="animate-fade-in-up mb-8 text-lg text-gray-600 opacity-0"
          style={{ animationDelay: "120ms" }}
        >
          For York University students at Keele, Markham & Glendon. Search by transit
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
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.title}
            className="animate-fade-in-up flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm opacity-0"
            style={{ animationDelay: card.delay }}
          >
            {/* Image area */}
            <div className="relative h-48 w-full bg-gray-50">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>

            {/* Text content */}
            <div className="p-5">
              <h2 className="mb-2 text-lg font-bold text-york-red">
                {card.title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
