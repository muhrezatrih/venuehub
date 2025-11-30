/**
 * API layer for data fetching
 * Connects to NestJS backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ============================================================
// TYPES
// ============================================================

export interface Location {
  id: string;
  name: string;
}

export interface LocationsResponse {
  data: Location[];
  total: number;
}

export interface Venue {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  price: number;
  locationId: string;
  locationName: string;
  capacityMin: number;
  capacityMax: number;
}

export interface VenueFilters {
  locationId?: string;
  name?: string;
  capacityMin?: number;
  capacityMax?: number;
  price?: number;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  perPage?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Booking types
export interface CreateBookingData {
  venueId: string;
  companyName: string;
  email: string;
  startDate: string;
  endDate: string;
  attendeeCount: number;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  venueId: string;
  venueName: string;
  companyName: string;
  email: string;
  startDate: string;
  endDate: string;
  attendeeCount: number;
  status: string;
  totalPrice: number | null;
  notes: string | null;
  createdAt: string;
}

export interface BookingSuccessResponse {
  success: true;
  message: string;
  data: BookingResponse;
}

export interface BookingErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export type BookingApiResponse = BookingSuccessResponse | BookingErrorResponse;

// ============================================================
// LOCATIONS API
// ============================================================

export async function getLocations(): Promise<Location[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result: LocationsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return [];
  }
}

// ============================================================
// VENUES API
// ============================================================

export async function getVenues(
  filters?: VenueFilters
): Promise<PaginatedResponse<Venue>> {
  try {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.locationId) {
        params.set('locationId', filters.locationId);
      }
      if (filters.name) {
        params.set('name', filters.name);
      }
      if (filters.capacityMin !== undefined) {
        params.set('capacityMin', String(filters.capacityMin));
      }
      if (filters.capacityMax !== undefined) {
        params.set('capacityMax', String(filters.capacityMax));
      }
      if (filters.price !== undefined) {
        params.set('price', String(filters.price));
      }
      if (filters.checkIn) {
        params.set('checkIn', filters.checkIn);
      }
      if (filters.checkOut) {
        params.set('checkOut', filters.checkOut);
      }
      if (filters.page) {
        params.set('page', String(filters.page));
      }
      if (filters.perPage) {
        params.set('perPage', String(filters.perPage));
      }
    }

    const url = `${API_BASE_URL}/venues?${params.toString()}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function getVenueById(id: string): Promise<Venue | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch venue:', error);
    return null;
  }
}

// ============================================================
// BOOKINGS API
// ============================================================

export async function createBooking(
  data: CreateBookingData
): Promise<BookingApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Booking failed. Please try again.',
        errors: result.message ? [result.message] : undefined,
      };
    }

    return result as BookingSuccessResponse;
  } catch (error) {
    console.error('Failed to create booking:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}

// ============================================================
// UTILS
// ============================================================

export function parseFiltersFromParams(
  searchParams: Record<string, string | string[] | undefined>
): VenueFilters {
  const filters: VenueFilters = {};

  if (searchParams.locationId && typeof searchParams.locationId === 'string') {
    filters.locationId = searchParams.locationId;
  }

  if (searchParams.name && typeof searchParams.name === 'string') {
    filters.name = searchParams.name;
  }

  if (searchParams.capacityMin) {
    const parsed = parseInt(searchParams.capacityMin as string, 10);
    if (!isNaN(parsed)) filters.capacityMin = parsed;
  }

  if (searchParams.capacityMax) {
    const parsed = parseInt(searchParams.capacityMax as string, 10);
    if (!isNaN(parsed)) filters.capacityMax = parsed;
  }

  if (searchParams.price) {
    const parsed = parseInt(searchParams.price as string, 10);
    if (!isNaN(parsed)) filters.price = parsed;
  }

  if (searchParams.checkIn && typeof searchParams.checkIn === 'string') {
    filters.checkIn = searchParams.checkIn;
  }

  if (searchParams.checkOut && typeof searchParams.checkOut === 'string') {
    filters.checkOut = searchParams.checkOut;
  }

  if (searchParams.page) {
    const parsed = parseInt(searchParams.page as string, 10);
    if (!isNaN(parsed) && parsed > 0) filters.page = parsed;
  }

  filters.perPage = 6

  return filters;
}