"use client";

import { useState, useRef, useEffect } from "react";
import { submitChat, type ChatMessage } from "@/app/actions/chat";
import { ChatMessage as ChatMessageComponent } from "@/components/ChatMessage";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you find housing by time to campus. Try asking: \"Find me a place under 30 mins from Markham campus\" or \"Show me rentals under 25 minutes to Keele\".",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const history: ChatMessage[] = [...messages, userMessage];

    const result = await submitChat(history);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: result.content }]);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Housing assistant</h1>

      <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex max-h-[60vh] flex-1 flex-col gap-4 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <ChatMessageComponent
              key={i}
              role={msg.role}
              content={msg.content}
            />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-gray-100 px-4 py-2 text-gray-500">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-gray-200 p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Find me a place under 30 mins from Markham campus"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            disabled={loading}
            aria-label="Chat message"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
