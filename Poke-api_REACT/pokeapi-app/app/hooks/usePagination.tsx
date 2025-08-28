import { useState } from "react";

export function usePagination(initialTotalItems: number, initialLimit = 5) {
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage(prev => (prev * limit < totalItems ? prev + 1 : prev));

  const handleLimitChange = (newLimit: number) => {
    const firstIndex = (currentPage - 1) * limit;
    const newPage = Math.floor(firstIndex / newLimit) + 1;
    setLimit(newLimit);
    setCurrentPage(newPage);
  };

  return {
    currentPage,
    limit,
    setCurrentPage,
    handlePrevPage,
    handleNextPage,
    handleLimitChange,
    totalItems,
    setTotalItems
  };
}
