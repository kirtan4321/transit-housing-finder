import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-york-red">
          <Image
            src="/york-housing-finder-logo.png"
            alt="York Housing Finder"
            width={48}
            height={48}
            className="h-15 w-auto object-contain sm:h-20"
          />
          York Housing Finder
        </Link>
        <nav className="flex gap-6" aria-label="Main navigation">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            Search
          </Link>
          <Link
            href="/chat"
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
