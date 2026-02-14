# York Housing Finder

Transit-oriented housing finder for York University students (Keele & Markham campuses). Search by **time to campus** instead of distance, with safety and reliability scores.

## Features

- **Time-based search** — Filter listings by “under 25 mins” to Keele or Markham campus.
- **Safety score** — Area safety ratings on each listing.
- **Transit reliability** — Reliability and frequency summary per listing.
- **AI chatbot** — Ask in plain language, e.g. “Find me a place under 30 mins from Markham campus.”

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- In-code listing data (no database required)
- Google Gemini for the chat assistant

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

- `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/apikey)

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
2. Add the environment variable `GEMINI_API_KEY` in the Vercel project settings.
3. Deploy.

## Project structure

- `src/app` — Pages (home, search, listings/[id], chat) and layout
- `src/components` — Header, Footer, SearchByTime, SearchFilters, ResultsList, ListingCard, ChatMessage
- `src/data/listings.ts` — Hardcoded listings and `getListings` / `getListing`
- `src/app/actions/chat.ts` — Server Action for the AI chat

## License

MIT
