import { useState, useMemo } from 'react';

export const usePagination = (items = [], itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    resetPagination,
    totalItems: items.length,
    itemsPerPage,
  };
};