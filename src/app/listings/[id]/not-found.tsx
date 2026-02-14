import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="mb-2 text-xl font-bold text-gray-900">Listing not found</h1>
      <p className="mb-6 text-gray-600">
        This listing doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/search"
        className="inline-block rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800"
      >
        Back to search
      </Link>
    </div>
  );
}
