interface ControlsProps {
  types: string[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPokemons: number;
}

export default function Controls({
  types,
  selectedType,
  setSelectedType,
  limit,
  setLimit,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPokemons
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded"
      />
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
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="border p-2 rounded"
      >
        {[5, 10, 20, 50, 100].map((num) => (
          <option key={num} value={num}>
            {num} Pokémon
          </option>
        ))}
      </select>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * limit >= totalPokemons}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
