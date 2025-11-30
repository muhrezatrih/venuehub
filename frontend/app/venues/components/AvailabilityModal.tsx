'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
  venueName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AvailabilityModal({
  isOpen,
  onClose,
  venueId,
  venueName,
}: AvailabilityModalProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleCheckAvailability = async () => {
    setError('');

    // Validate dates
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    // Validate check-in date is today or later
    if (checkIn < today) {
      setError('Check-in date must be today or a future date');
      return;
    }

    // Validate check-out is after check-in
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setIsChecking(true);

    try {
      // Check availability by querying venues with date filter
      const params = new URLSearchParams({
        checkIn,
        checkOut,
      });

      const response = await fetch(
        `${API_BASE_URL}/venues/${venueId}/availability?${params.toString()}`
      );

      if (!response.ok) {
        // If endpoint doesn't exist, fallback to checking via venues list
        const fallbackResponse = await fetch(
          `${API_BASE_URL}/venues?checkIn=${checkIn}&checkOut=${checkOut}`
        );
        const data = await fallbackResponse.json();
        const isAvailable = data.data?.some((v: { id: string }) => v.id === venueId);

        if (isAvailable) {
          // Navigate to booking page with dates
          router.push(`/venues/${venueId}/book?checkIn=${checkIn}&checkOut=${checkOut}`);
        } else {
          setError('Sorry, this venue is not available for the selected dates. Please try different dates.');
        }
        return;
      }

      const data = await response.json();

      if (data.available) {
        // Navigate to booking page with dates
        router.push(`/venues/${venueId}/book?checkIn=${checkIn}&checkOut=${checkOut}`);
      } else {
        setError('Sorry, this venue is not available for the selected dates. Please try different dates.');
      }
    } catch (err) {
      console.error('Availability check failed:', err);
      setError('Failed to check availability. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    setError('');
    // Reset check-out if it's before new check-in
    if (checkOut && value && checkOut <= value) {
      setCheckOut('');
    }
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    setError('');
  };

  const handleClose = () => {
    setCheckIn('');
    setCheckOut('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">
              Check Availability
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-stone-500 mt-1">{venueName}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Check-in */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                disabled={!checkIn}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-amber-800">
                Select your preferred dates to check if the venue is available
                before proceeding to book.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={isChecking || !checkIn || !checkOut}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-xl transition-colors duration-200 flex items-center gap-2"
          >
            {isChecking ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Checking...
              </>
            ) : (
              <>
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
                Check Availability
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}