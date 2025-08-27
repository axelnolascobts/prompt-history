import React from "react";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function Search({ searchTerm, setSearchTerm }: SearchProps) {
  return (
    <input
      type="text"
      placeholder="Search Pokémon"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
}
