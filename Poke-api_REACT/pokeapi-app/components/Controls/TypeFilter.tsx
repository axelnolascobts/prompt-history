'use client';

interface TypeFilterProps {
  types: string[]; 
  selectedType: string;
  setSelectedType: (value: string) => void;
  setCurrentPage: (value: number) => void;
  className?: string; 
}

export default function TypeFilter({
  types = [], 
  selectedType,
  setSelectedType,
  setCurrentPage,
  className
}: TypeFilterProps) {
  return (
    <select
      value={selectedType}
      onChange={(e) => { 
        setSelectedType(e.target.value); 
        setCurrentPage(1); 
      }}
      className={className}
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
