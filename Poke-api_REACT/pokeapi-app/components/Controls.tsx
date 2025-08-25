import React from "react";

interface ControlsProps {
  types: string[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  limit: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPokemons: number;
  handleLimitChange: (newLimit: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}


export default function Controls({
  types,
  selectedType,
  setSelectedType,
  limit,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPokemons,
  handleLimitChange,
  handleNextPage,
  handlePrevPage,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded"
      />

      {/* Type filter */}
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          setCurrentPage(1);
        }}
        className="border p-2 rounded"
      >
        <option value="">All types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {/* Limit per page */}
      <select
        value={limit}
        onChange={(e) => handleLimitChange(Number(e.target.value))}
        className="border p-2 rounded"
      >
        {[5, 10, 20, 50, 100].map((num) => (
          <option key={num} value={num}>
            {num} Pokémon
          </option>
        ))}
      </select>

      {/* Pagination buttons */}
      <div className="flex gap-2 items-center">
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
    </div>
  );
}
