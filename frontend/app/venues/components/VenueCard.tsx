/**
 * VenueCard Component (Server Component)
 * Displays a single venue in the listing grid
 */

import Link from 'next/link';
import { Venue } from '@/lib/api';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out border border-stone-100">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        {venue.image ? (
          <img
            src={venue.image}
            alt={venue.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-400 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center"
          >
            <span className="text-stone-500 text-sm">{venue.name}</span>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4">
          <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-lg font-bold text-stone-900">
              ${venue.price}
            </span>
            <span className="text-stone-500 text-sm">/day</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-stone-900 truncate group-hover:text-amber-700 transition-colors duration-300">
              {venue.name}
            </h3>
            <p className="flex items-center gap-1.5 text-stone-500 text-sm mt-0.5">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{venue.locationName}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {venue.description}
          </p>
        )}

        {/* Capacity */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>
            {venue.capacityMin} – {venue.capacityMax} guests
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-4 border-t border-stone-100">
          <Link
            href={`/venues/${venue.id}`}
            className="block w-full py-2.5 px-4 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 active:bg-stone-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}