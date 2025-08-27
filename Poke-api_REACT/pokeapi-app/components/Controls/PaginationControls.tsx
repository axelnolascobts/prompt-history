import React from "react";

interface PaginationProps {
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  totalPokemons: number;
  limit: number;
}

export default function PaginationControls({ currentPage, handlePrevPage, handleNextPage, totalPokemons, limit }: PaginationProps) {
  return (
    <div className="flex gap-2 items-center">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="border px-3 py-1 rounded disabled:opacity-50">
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button onClick={handleNextPage} disabled={currentPage * limit >= totalPokemons} className="border px-3 py-1 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  );
}
