"use server";

import { GoogleGenAI } from "@google/genai";
import { getListings, type CampusSlug, type Listing } from "@/data/listings";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function parseSearchIntent(text: string): { campus: CampusSlug; maxMinutes: number } | null {
  const lower = text.toLowerCase();

  // Only parse intent if the message looks like a housing search
  const isSearch =
    /find|show|search|list|look|under|near|close|rent|hous|place|apartment|mins|minutes|campus/i.test(
      lower
    );
  if (!isSearch) return null;

  const campus: CampusSlug = lower.includes("markham")
    ? "markham"
    : lower.includes("glendon")
      ? "glendon"
      : "keele";
  const match = text.match(/(\d+)\s*min/i) || text.match(/under\s*(\d+)/i);
  const maxMinutes = match
    ? Math.min(60, Math.max(10, parseInt(match[1], 10)))
    : 30;
  return { campus, maxMinutes };
}

function getMinutesForCampus(listing: Listing, campus: CampusSlug): number {
  if (campus === "keele") return listing.minutes_to_keele;
  if (campus === "markham") return listing.minutes_to_markham;
  return listing.minutes_to_glendon;
}

const CAMPUS_LABELS: Record<CampusSlug, string> = {
  keele: "Keele Campus",
  markham: "Markham Campus",
  glendon: "Glendon Campus",
};

/* ------------------------------------------------------------------ */
/*  Smart fallback: generate a helpful response without an LLM        */
/* ------------------------------------------------------------------ */

function buildFallbackResponse(
  userText: string,
  intent: { campus: CampusSlug; maxMinutes: number } | null,
  results: Listing[]
): string {
  // Generic greeting / non-search message
  if (!intent) {
    return (
      "I can help you find housing near York University! Try something like:\n\n" +
      '• "Find me a place under 25 mins from Keele"\n' +
      '• "Show rentals near Markham campus under 40 minutes"\n' +
      '• "What\'s available near Glendon under 20 mins?"'
    );
  }

  const label = CAMPUS_LABELS[intent.campus];

  if (results.length === 0) {
    return (
      `I couldn't find any listings within ${intent.maxMinutes} minutes of ${label}. ` +
      `Try increasing the time — for example, "under 45 mins from ${intent.campus}" — ` +
      `or check the [full search page](/search?campus=${intent.campus}&max=60).`
    );
  }

  const top = results.slice(0, 5);
  const lines = top.map((l) => {
    const mins = getMinutesForCampus(l, intent.campus);
    return `• [${l.address}](/listings/${l.id}) — ${mins} min, $${l.rent.toLocaleString()}/mo, safety ${l.safety_score}/5`;
  });

  return (
    `Here are the best options within ${intent.maxMinutes} minutes of ${label}:\n\n` +
    lines.join("\n") +
    `\n\nYou can also [view all results on the search page](/search?campus=${intent.campus}&max=${intent.maxMinutes}).`
  );
}

/* ------------------------------------------------------------------ */
/*  Build listing context string for the LLM prompt                   */
/* ------------------------------------------------------------------ */

function buildListingsContext(
  intent: { campus: CampusSlug; maxMinutes: number } | null,
  results: Listing[]
): string {
  if (!intent) return "";

  if (results.length === 0) {
    return "No listings match that criteria. Suggest trying a higher max time (e.g. 40 or 50 minutes).";
  }

  return (
    `Here are the matching listings (include these links in your reply when suggesting places):\n` +
    results
      .slice(0, 5)
      .map(
        (l) =>
          `- ${l.address}: ${getMinutesForCampus(l, intent.campus)} min, $${l.rent}/mo. Link: /listings/${l.id}`
      )
      .join("\n") +
    `\n\nYou can also suggest the user view all results at: /search?campus=${intent.campus}&max=${intent.maxMinutes}`
  );
}

/* ------------------------------------------------------------------ */
/*  Main entry point                                                  */
/* ------------------------------------------------------------------ */

export async function submitChat(
  messages: ChatMessage[]
): Promise<{ content: string; error?: string }> {
  const lastUser = messages.filter((m) => m.role === "user").pop();
  const userText = lastUser?.content ?? "";
  const intent = parseSearchIntent(userText);

  // Fetch listings when there is a search intent
  const results = intent ? await getListings(intent.campus, intent.maxMinutes) : [];

  // --- Try Gemini first ---
  const ai = getGeminiClient();
  if (ai) {
    const listingsContext = buildListingsContext(intent, results);

    const systemPrompt = `You are Right On Stop, a helpful assistant for York University students finding housing near Keele Campus, Markham Campus, and Glendon Campus. You help them find rentals by transit time.

We have listings with:
- minutes_to_keele: transit time to Keele Campus
- minutes_to_markham: transit time to Markham Campus
- minutes_to_glendon: transit time to Glendon Campus
- address, rent, safety score, reliability

When the user asks for places (e.g. "find me a place under 30 mins from Markham campus"), use the listing data provided below and reply with a short friendly summary. Include direct links to listing detail pages using the path /listings/[id] (e.g. [123 Example St](/listings/1)). For markdown links use format [text](/listings/id). Also suggest they can see all results at the search page link if provided.

${listingsContext}`;

    try {
      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 500,
        },
      });

      const content =
        response.text?.trim() ?? "I couldn't generate a response. Try again.";
      return { content };
    } catch {
      // Gemini failed (quota, network, etc.) — fall through to smart fallback
      console.error("[Chat] Gemini call failed, using smart fallback");
    }
  }

  // --- Smart fallback (no API key or Gemini failed) ---
  const content = buildFallbackResponse(userText, intent, results);
  return { content };
}
