// components/Footer.tsx
import React from "react";

interface FooterProps {
  currentPage: number;
  totalPokemons: number;
  limit: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  searchActive: boolean; // Oculta paginación durante búsqueda
}

export default function Footer({
  currentPage,
  totalPokemons,
  limit,
  handlePrevPage,
  handleNextPage,
  searchActive
}: FooterProps) {
  if (searchActive) return null; // Oculta paginación si hay búsqueda

  return (
    <div className="flex gap-2 items-center justify-center mt-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="border px-3 py-1 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage * limit >= totalPokemons}
        className="border px-3 py-1 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
