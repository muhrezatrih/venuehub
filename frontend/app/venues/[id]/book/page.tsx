import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getVenueById } from '@/lib/api';
import BookingForm from '../../components/BookingForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { checkIn, checkOut } = await searchParams;

  const venue = await getVenueById(id);

  if (!venue) {
    notFound();
  }

  // Calculate total days & total price
  const totalDays =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = totalDays * venue.price;

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
          href={`/venues/${id}`}
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
          Back to Venue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-stone-900 mb-6">
                Book {venue.name}
              </h1>
              <BookingForm
                venueId={id}
                capacityMin={venue.capacityMin}
                capacityMax={venue.capacityMax}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
              />
            </div>
          </div>

          {/* Venue Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden sticky top-8">
              {/* Image */}
              <div className="relative aspect-video bg-stone-200">
                {venue.image ? (
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
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
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-stone-900 mb-1">
                  {venue.name}
                </h2>
                <div className="flex items-center gap-1 text-stone-500 text-sm mb-4">
                  <svg
                    className="w-4 h-4"
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

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Capacity</span>
                    <span className="font-semibold text-stone-900">
                      {venue.capacityMin} - {venue.capacityMax} guests
                    </span>
                  </div>

                  {/* Selected Dates */}
                  {checkIn && checkOut && (
                    <div className="flex items-center justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Selected Dates</span>
                      <span className="font-semibold text-stone-900 text-right">
                        {new Date(checkIn).toLocaleDateString('en-GB')} -{' '}
                        {new Date(checkOut).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  )}

                  {/* Total Price */}
                  {checkIn && checkOut && (
                    <div className="flex items-center justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Total Price (1 venue x {totalDays}{' '}{totalDays > 1 ? 'days' : 'day'})</span>
                      <span className="font-semibold text-stone-900">
                        US${totalPrice.toLocaleString()} 
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-green-800">
                      Availability confirmed for selected dates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
