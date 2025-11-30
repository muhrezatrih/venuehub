/**
 * Venue Not Found Page
 * Displayed when venue ID doesn't exist
 */

import Link from 'next/link';

export default function VenueNotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Venue Not Found
        </h1>
        <p className="text-stone-500 mb-8 max-w-md">
          Sorry, we couldn&apos;t find the venue you&apos;re looking for. It may
          have been removed or the link might be incorrect.
        </p>
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Venues
        </Link>
      </div>
    </main>
  );
}