'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVenueById, Venue } from '@/lib/api';
import AvailabilityModal from '../components/AvailabilityModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VenueDetailPage({ params }: PageProps) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvedId, setResolvedId] = useState<string>('');

  useEffect(() => {
    async function loadVenue() {
      const { id } = await params;
      setResolvedId(id);

      try {
        const venueData = await getVenueById(id);
        if (!venueData) {
          notFound();
        }
        setVenue(venueData);
      } catch (error) {
        console.error('Failed to load venue:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [params]);

  if (isLoading) {
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
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-stone-200 rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-stone-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-stone-200 rounded" />
                <div className="h-6 w-1/2 bg-stone-200 rounded" />
                <div className="h-24 bg-stone-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!venue) {
    notFound();
  }

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
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
              >
                Browse Venues
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Venues
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200">
            {venue.image ? (
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-stone-400"
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
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-stone-900 mb-2">
                  {venue.name}
                </h1>
                <div className="flex items-center gap-2 text-stone-500">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {venue.locationName}
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-700">
                  ${venue.price}
                </span>
                <span className="text-amber-600">/ day</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">Capacity</span>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {venue.capacityMin} - {venue.capacityMax} guests
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm">Type</span>
                </div>
                <p className="text-lg font-semibold text-stone-900">Venue</p>
              </div>
            </div>

            {/* Description */}
            {venue.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  About this venue
                </h2>
                <p className="text-stone-600 leading-relaxed">
                  {venue.description}
                </p>
              </div>
            )}

            {/* Book Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book This Venue
            </button>
          </div>
        </div>
      </div>

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        venueId={resolvedId}
        venueName={venue.name}
      />
    </main>
  );
}