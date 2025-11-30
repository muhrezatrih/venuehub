'use client';

/**
 * FilterBar Component (Client Component)
 * Fetches locations from API and handles filter interactions
 */

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useState, useTransition, useEffect, useRef } from 'react';
import { getLocations, Location, VenueFilters } from '@/lib/api';

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State for locations from API
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Location search state
  const [locationSearch, setLocationSearch] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch locations on component mount
  useEffect(() => {
    async function fetchLocations() {
      setIsLoadingLocations(true);
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Failed to load locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    }

    fetchLocations();
  }, []);

  // Sync selected location with URL params
  useEffect(() => {
    const locationId = searchParams.get('locationId');
    if (locationId) {
      const location = locations.find((loc) => loc.id === locationId);
      if (location) {
        setSelectedLocation(location);
        setLocationSearch(location.name);
      }
    } else {
      setSelectedLocation(null);
      setLocationSearch('');
    }
  }, [searchParams, locations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations based on search
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Parse current filters from URL
  const currentFilters: VenueFilters = {
    locationId: searchParams.get('locationId') || '',
    name: searchParams.get('name') || '',
    capacityMin: searchParams.get('capacityMin')
      ? parseInt(searchParams.get('capacityMin')!)
      : undefined,
    capacityMax: searchParams.get('capacityMax')
      ? parseInt(searchParams.get('capacityMax')!)
      : undefined,
    price: searchParams.get('price')
      ? parseInt(searchParams.get('price')!)
      : undefined,
  };

  /**
   * Updates URL search params with new filter values
   */
  const updateFilters = useCallback(
    (updates: Partial<VenueFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset to page 1 when filters change
      params.delete('page');

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router, pathname]
  );

  /**
   * Clears all active filters
   */
  const clearAllFilters = useCallback(() => {
    setLocationSearch('');
    setSelectedLocation(null);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [router, pathname]);

  /**
   * Handle location select
   */
  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
    setLocationSearch(location?.name || '');
    setIsLocationDropdownOpen(false);
    updateFilters({ locationId: location?.id || '' });
  };

  // Count active filters
  const activeFilterCount = [
    currentFilters.locationId,
    currentFilters.name,
    currentFilters.capacityMin !== undefined,
    currentFilters.capacityMax !== undefined,
    currentFilters.price !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 relative">
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Location Search Dropdown */}
          <div className="flex-1 min-w-[180px] relative" ref={locationDropdownRef}>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              Location
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search locations..."
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  setIsLocationDropdownOpen(true);
                  if (!e.target.value) {
                    handleLocationSelect(null);
                  }
                }}
                onFocus={() => setIsLocationDropdownOpen(true)}
                disabled={isLoadingLocations}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-8 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              {selectedLocation && (
                <button
                  type="button"
                  onClick={() => handleLocationSelect(null)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 z-10"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {isLocationDropdownOpen && !isLoadingLocations && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
                {filteredLocations.length > 0 ? (
                  <>
                    {!selectedLocation && (
                      <button
                        type="button"
                        onClick={() => handleLocationSelect(null)}
                        className="w-full px-4 py-2.5 text-left text-sm text-stone-500 hover:bg-stone-50"
                      >
                        All Locations
                      </button>
                    )}
                    {filteredLocations.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-stone-50 flex items-center justify-between ${
                          selectedLocation?.id === location.id
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-stone-700'
                        }`}
                      >
                        {location.name}
                        {selectedLocation?.id === location.id && (
                          <svg
                            className="w-4 h-4 text-amber-500"
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
                        )}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-stone-500">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Name Search */}
          <div className="flex-1 min-w-[160px]">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2"
            >
              Search Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Search venues..."
              value={currentFilters.name}
              onChange={(e) => updateFilters({ name: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Capacity Range - onChange (immediate) */}
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              Guest Capacity
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min={0}
                value={currentFilters.capacityMin ?? ''}
                onChange={(e) =>
                  updateFilters({
                    capacityMin: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
              <span className="text-stone-300">–</span>
              <input
                type="number"
                placeholder="Max"
                min={0}
                value={currentFilters.capacityMax ?? ''}
                onChange={(e) =>
                  updateFilters({
                    capacityMax: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Max Price - onChange (immediate) */}
          <div className="min-w-[140px]">
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              Max Price / Day
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                $
              </span>
              <input
                type="number"
                placeholder="Max price"
                min={0}
                value={currentFilters.price ?? ''}
                onChange={(e) =>
                  updateFilters({
                    price: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-7 pr-4 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isPending && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}