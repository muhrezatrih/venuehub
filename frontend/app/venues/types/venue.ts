/**
 * Core venue type definitions
 * These types are used throughout the application for type safety
 */

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  capacity: {
    min: number;
    max: number;
  };
  pricePerHour: number;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface VenueFilters {
  location?: string;
  capacityMin?: number;
  capacityMax?: number;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  perPage?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const DEFAULT_PER_PAGE = 6;

export const LOCATIONS = [
  'All Locations',
  'New York',
  'Los Angeles',
  'Chicago',
  'San Francisco',
  'Miami',
  'Austin',
  'Seattle',
  'Boston',
] as const;

export type Location = (typeof LOCATIONS)[number];