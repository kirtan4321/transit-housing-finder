import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Right On Stop"
            width={240}
            height={48}
            className="h-[52px] w-auto object-contain sm:h-[62px]"
            priority
          />
        </Link>
        <nav className="flex items-center gap-8" aria-label="Main navigation">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
          >
            Search
          </Link>
          <Link
            href="/map"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
          >
            Map
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
          >
            Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
