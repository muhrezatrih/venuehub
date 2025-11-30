import { VenueListSkeleton } from './components/VenueList';

export default function Loading() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-stone-200 rounded w-24 mb-3" />
            <div className="h-10 bg-stone-200 rounded w-64 mb-2" />
            <div className="h-5 bg-stone-100 rounded w-96" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-stone-100 p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 lg:max-w-xs">
              <div className="h-3 bg-stone-200 rounded w-16 mb-2" />
              <div className="h-10 bg-stone-100 rounded w-full" />
            </div>
            <div className="flex-1 lg:max-w-xs">
              <div className="h-3 bg-stone-200 rounded w-24 mb-2" />
              <div className="flex gap-2">
                <div className="h-10 bg-stone-100 rounded flex-1" />
                <div className="h-10 bg-stone-100 rounded flex-1" />
              </div>
            </div>
            <div className="flex-1 lg:max-w-xs">
              <div className="h-3 bg-stone-200 rounded w-20 mb-2" />
              <div className="flex gap-2">
                <div className="h-10 bg-stone-100 rounded flex-1" />
                <div className="h-10 bg-stone-100 rounded flex-1" />
              </div>
            </div>
            <div className="h-10 bg-stone-100 rounded w-28 lg:ml-auto" />
          </div>
        </div>

        <div className="mb-6 animate-pulse">
          <div className="h-5 bg-stone-200 rounded w-32" />
        </div>

        <VenueListSkeleton />
      </div>
    </main>
  );
}
