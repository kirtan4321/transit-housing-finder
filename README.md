# Right On Stop

Transit-oriented housing finder for York University students (Keele, Markham & Glendon campuses). Search by **time to campus** instead of distance, with safety and reliability scores.

## Features

- **Time-based search** — Filter listings by “under 25 mins” to Keele or Markham campus.
- **Safety score** — Area safety ratings on each listing.
- **Transit reliability** — Reliability and frequency summary per listing.
- **AI chatbot** — Ask in plain language, e.g. “Find me a place under 30 mins from Markham campus.”

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- In-code listing data (no database required)
- **Geoapify Routing API** (transit mode) for travel time to campus, bus/train line names, and route geometry
- **Leaflet** for map display (listing, closest bus stop, and transit route line)
- **OpenRouteService** (optional) for nearest bus stop POI
- OpenAI (gpt-4o-mini) for the chat assistant

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and add your OpenAI API key (required for the Chat page):

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

- `OPENAI_API_KEY` — from [OpenAI](https://platform.openai.com) (required for Chat)
- `GEOAPIFY_API_KEY` — from [Geoapify](https://www.geoapify.com/) (required for transit routes, times, and map geometry; without it, fallback minutes are used and no route is drawn)
- `OPENROUTESERVICE_API_KEY` — optional, for closest bus stop; from [OpenRouteService](https://openrouteservice.org/dev/#/signup)

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add the environment variable `OPENAI_API_KEY` in the Vercel project settings.
3. Deploy.

## Project structure

- `src/app` — Pages (home, search, listings/[id], chat) and layout
- `src/components` — Header, Footer, SearchByTime, SearchFilters, ResultsList, ListingCard, ChatMessage
- `src/data/listings.ts` — Hardcoded listings and `getListings` / `getListing`
- `src/app/actions/chat.ts` — Server Action for the AI chat

## License

MIT
