"use server";

import OpenAI from "openai";
import { getListings, type CampusSlug } from "@/data/listings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ChatMessage = { role: "user" | "assistant"; content: string };

function parseSearchIntent(text: string): { campus: CampusSlug; maxMinutes: number } | null {
  const lower = text.toLowerCase();
  const campus: CampusSlug = lower.includes("markham") ? "markham" : "keele";
  const match = text.match(/(\d+)\s*min/i) || text.match(/under\s*(\d+)/i);
  const maxMinutes = match ? Math.min(60, Math.max(10, parseInt(match[1], 10))) : 30;
  return { campus, maxMinutes };
}

export async function submitChat(messages: ChatMessage[]): Promise<{ content: string; error?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      content: "",
      error: "Chat is not configured. Please set OPENAI_API_KEY.",
    };
  }

  const lastUser = messages.filter((m) => m.role === "user").pop();
  const userText = lastUser?.content ?? "";
  const intent = parseSearchIntent(userText);

  let listingsContext = "";
  if (intent) {
    const results = await getListings(intent.campus, intent.maxMinutes);
    if (results.length > 0) {
      listingsContext = `Here are the matching listings (include these links in your reply when suggesting places):\n${results
        .slice(0, 5)
        .map(
          (l) =>
            `- ${l.address}: ${intent.campus === "keele" ? l.minutes_to_keele : l.minutes_to_markham} min, $${l.rent}/mo. Link: /listings/${l.id}`
        )
        .join("\n")}\n\nYou can also suggest the user view all results at: /search?campus=${intent.campus}&max=${intent.maxMinutes}`;
    } else {
      listingsContext = "No listings match that criteria. Suggest trying a higher max time (e.g. 40 or 50 minutes).";
    }
  }

  const systemPrompt = `You are a helpful assistant for York University students finding housing near Keele Campus and Markham Campus. You help them find rentals by transit time.

We have listings with:
- minutes_to_keele: transit time to Keele Campus
- minutes_to_markham: transit time to Markham Campus
- address, rent, safety score, reliability

When the user asks for places (e.g. "find me a place under 30 mins from Markham campus"), use the listing data provided below and reply with a short friendly summary. Include direct links to listing detail pages using the path /listings/[id] (e.g. [123 Example St](/listings/1)). For markdown links use format [text](/listings/id). Also suggest they can see all results at the search page link if provided.

${listingsContext}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "I couldn’t generate a response. Try again.";
    return { content };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      content: "",
      error: `Something went wrong: ${message}. Check your API key and try again.`,
    };
  }
}
