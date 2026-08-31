'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === pageNum
                ? 'bg-brand-orange text-brand-black'
                : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}