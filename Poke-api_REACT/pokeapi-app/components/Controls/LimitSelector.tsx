import React from "react";

interface LimitSelectorProps {
  limit: number;
  handleLimitChange: (newLimit: number) => void;
}

export default function LimitSelector({ limit, handleLimitChange }: LimitSelectorProps) {
  return (
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
  );
}
