import Link from "next/link";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

/** Renders assistant content and turns [text](/path) into Next.js Link */
function renderContent(content: string) {
  const parts: React.ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className="text-red-700 underline hover:text-red-800"
      >
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts.length > 0 ? parts : content;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      role="article"
      aria-label={isUser ? "Your message" : "Assistant message"}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isUser
            ? "bg-red-700 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {isUser ? content : renderContent(content)}
        </div>
      </div>
    </div>
  );
}
