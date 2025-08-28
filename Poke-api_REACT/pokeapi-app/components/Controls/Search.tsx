interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (term: string) => void;
 
  
}

export default function Search({ searchTerm, setSearchTerm, handleSearch }: SearchProps) {
  return (
    <div className="flex gap-2 w-full">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
        className="input_field"
      />
      <button
        onClick={() => handleSearch(searchTerm)}
        className="search"
      >
      </button>
    </div>
  );
}
