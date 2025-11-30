'use client';

/**
 * Pagination Component (Client Component)
 * Handles page navigation using URL search params
 */

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Pagination } from '@/lib/api';

interface PaginationProps {
  pagination: Pagination;
}

export default function PaginationBar({ pagination }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { currentPage, totalPages, totalItems, perPage } = pagination;

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    [searchParams, router, pathname]
  );

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate visible page numbers
  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-stone-200"
    >
      {/* Results info */}
      <p className="text-sm text-stone-500 order-2 sm:order-1">
        Showing{' '}
        <span className="font-medium text-stone-700">{startItem}</span>
        {' '}–{' '}
        <span className="font-medium text-stone-700">{endItem}</span>
        {' '}of{' '}
        <span className="font-medium text-stone-700">{totalItems}</span>
        {' '}venues
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous button */}
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Previous page"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-stone-400"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                disabled={isPending}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  page === currentPage
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Next page"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}