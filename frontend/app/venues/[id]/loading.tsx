/**
 * Loading State for Venue Detail Page
 */

export default function VenueDetailLoading() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-32 bg-stone-200 rounded animate-pulse" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="aspect-[4/3] rounded-2xl bg-stone-200 animate-pulse" />

          {/* Details Skeleton */}
          <div className="flex flex-col">
            {/* Title */}
            <div className="mb-6">
              <div className="h-10 w-3/4 bg-stone-200 rounded animate-pulse mb-3" />
              <div className="h-6 w-1/3 bg-stone-100 rounded animate-pulse" />
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-pulse">
              <div className="h-10 w-1/3 bg-stone-200 rounded mb-4" />
              <div className="h-12 w-full bg-stone-200 rounded-lg" />
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200" />
                  <div>
                    <div className="h-3 w-16 bg-stone-200 rounded mb-2" />
                    <div className="h-5 w-20 bg-stone-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200" />
                  <div>
                    <div className="h-3 w-16 bg-stone-200 rounded mb-2" />
                    <div className="h-5 w-20 bg-stone-200 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 animate-pulse">
              <div className="h-6 w-1/3 bg-stone-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-2/3 bg-stone-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}