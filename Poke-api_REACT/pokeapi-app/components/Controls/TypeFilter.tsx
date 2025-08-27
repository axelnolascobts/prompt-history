import React from "react";

interface TypeFilterProps {
  types: string[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

export default function TypeFilter({ types, selectedType, setSelectedType, setCurrentPage }: TypeFilterProps) {
  return (
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
  );
}
