/**
 * Venues Page (Server Component)
 * Fetches venues from API based on URL params
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { getVenues, parseFiltersFromParams } from '@/lib/api';
import FilterBar from './components/FilterBar';
import VenueList, { VenueListSkeleton } from './components/VenueList';
import Pagination from './components/Pagination';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VenuesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFiltersFromParams(resolvedSearchParams);

  // Fetch venues from API
  const { data: venues, pagination } = await getVenues(filters);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-stone-900">VenueHub</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/venues"
                className="text-amber-600 text-sm font-medium"
              >
                Browse Venues
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-amber-600 font-medium text-sm tracking-wide uppercase mb-2">
            Discover Spaces
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Find Your Perfect Venue
          </h1>
          <p className="mt-2 text-stone-500 text-lg max-w-2xl">
            Browse our curated collection of unique spaces for events,
            meetings, and celebrations.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-8">
          <Suspense
            fallback={
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 animate-pulse h-32" />
            }
          >
            <FilterBar />
          </Suspense>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-stone-600">
            <span className="font-semibold text-stone-900">
              {pagination.totalItems}
            </span>{' '}
            {pagination.totalItems === 1 ? 'venue' : 'venues'} found
          </p>
          {pagination.totalPages > 1 && (
            <p className="text-sm text-stone-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          )}
        </div>

        {/* Venue Grid */}
        <Suspense fallback={<VenueListSkeleton />}>
          <VenueList venues={venues} />
        </Suspense>

        {/* Pagination */}
        <Suspense fallback={null}>
          <Pagination pagination={pagination} />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="font-semibold text-stone-900">VenueHub</span>
            </Link>
            <p className="text-stone-500 text-sm">
              © 2025 VenueHub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-stone-500 hover:text-stone-700 text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-stone-500 hover:text-stone-700 text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-stone-500 hover:text-stone-700 text-sm transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}