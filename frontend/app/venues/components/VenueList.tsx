/**
 * VenueList Component (Server Component)
 * Displays the grid of venue cards with empty state
 */

import { Venue } from '@/lib/api';
import VenueCard from './VenueCard';

interface VenueListProps {
  venues: Venue[];
}

export default function VenueList({ venues }: VenueListProps) {
  if (venues.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 mb-6 rounded-full bg-stone-100 flex items-center justify-center">
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-stone-900 mb-2">
        No venues found
      </h3>
      <p className="text-stone-500 text-center max-w-md mb-6">
        We couldn&apos;t find any venues matching your criteria. Try adjusting
        your filters or broadening your search.
      </p>
      <div className="flex items-center gap-2 text-sm text-stone-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Tip: Try removing some filters to see more results
      </div>
    </div>
  );
}

export function VenueListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  );
}

function VenueCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 animate-pulse">
      <div className="h-56 bg-stone-200" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="h-5 bg-stone-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-stone-100 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-stone-100 rounded w-full" />
          <div className="h-4 bg-stone-100 rounded w-5/6" />
        </div>
        <div className="h-4 bg-stone-100 rounded w-32 mb-4" />
        <div className="pt-4 border-t border-stone-100">
          <div className="h-10 bg-stone-200 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
}