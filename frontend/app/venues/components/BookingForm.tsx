'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, CreateBookingData } from '@/lib/api';

interface BookingFormProps {
  venueId: string;
  capacityMin: number;
  capacityMax: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

interface FormData {
  companyName: string;
  email: string;
  startDate: string;
  endDate: string;
  attendeeCount: string;
  notes: string;
}

interface FormErrors {
  companyName?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
  attendeeCount?: string;
  general?: string;
}

export default function BookingForm({
  venueId,
  capacityMin,
  capacityMax,
  initialCheckIn,
  initialCheckOut,
}: BookingFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    startDate: initialCheckIn || '',
    endDate: initialCheckOut || '',
    attendeeCount: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Company name
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Start date
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (formData.startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    // End date
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Attendee count
    if (!formData.attendeeCount) {
      newErrors.attendeeCount = 'Number of attendees is required';
    } else {
      const count = parseInt(formData.attendeeCount, 10);
      if (isNaN(count) || count < 1) {
        newErrors.attendeeCount = 'Please enter a valid number';
      } else if (count < capacityMin) {
        newErrors.attendeeCount = `Minimum ${capacityMin} attendees required`;
      } else if (count > capacityMax) {
        newErrors.attendeeCount = `Maximum capacity is ${capacityMax} attendees`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const bookingData: CreateBookingData = {
        venueId,
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        attendeeCount: parseInt(formData.attendeeCount, 10),
        notes: formData.notes.trim() || undefined,
      };

      const result = await createBooking(bookingData);

      if (result.success && result.data) {
        setIsSuccess(true);
        setBookingId(result.data.id);
      } else {
        setErrors({ general: result.message || 'Failed to create booking' });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-stone-900 mb-2">
          Booking Request Submitted!
        </h3>
        <p className="text-stone-600 mb-4">
          Your booking inquiry has been received. We'll contact you shortly at{' '}
          <span className="font-medium">{formData.email}</span>
        </p>
        {bookingId && (
          <p className="text-sm text-stone-500 mb-6">
            Reference ID: <span className="font-mono">{bookingId}</span>
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/venues')}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            Browse More Venues
          </button>
          <button
            type="button"
            onClick={() => router.push(`/venues/${venueId}`)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            Back to Venue
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
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
            <p className="text-red-700">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Company Name */}
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={`w-full bg-stone-50 border rounded-lg px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
            errors.companyName ? 'border-red-300' : 'border-stone-200'
          }`}
          placeholder="Enter your company name"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full bg-stone-50 border rounded-lg px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
            errors.email ? 'border-red-300' : 'border-stone-200'
          }`}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            disabled
            className={`w-full bg-stone-50 border rounded-lg px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
              errors.startDate ? 'border-red-300' : 'border-stone-200'
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            disabled
            className={`w-full bg-stone-50 border rounded-lg px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
              errors.endDate ? 'border-red-300' : 'border-stone-200'
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Attendee Count */}
      <div>
        <label
          htmlFor="attendeeCount"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Number of Attendees <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="attendeeCount"
          name="attendeeCount"
          value={formData.attendeeCount}
          onChange={handleChange}
          min={capacityMin}
          max={capacityMax}
          className={`w-full bg-stone-50 border rounded-lg px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
            errors.attendeeCount ? 'border-red-300' : 'border-stone-200'
          }`}
          placeholder={`${capacityMin} - ${capacityMax} guests`}
        />
        {errors.attendeeCount && (
          <p className="mt-1 text-sm text-red-500">{errors.attendeeCount}</p>
        )}
        <p className="mt-1 text-xs text-stone-500">
          This venue accommodates {capacityMin} to {capacityMax} guests
        </p>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Additional Notes <span className="text-stone-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Any special requirements or requests..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="w-5 h-5 animate-spin"
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
            Submitting...
          </>
        ) : (
          'Submit Booking Request'
        )}
      </button>
    </form>
  );
}