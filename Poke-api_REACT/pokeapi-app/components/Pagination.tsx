interface PaginationProps {
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  totalPokemons: number;
  limit: number;
}

export default function Pagination({ currentPage, handlePrevPage, handleNextPage, totalPokemons, limit }: PaginationProps) {
  return (
    <div>
      <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
      <span>{currentPage}</span>
      <button onClick={handleNextPage} disabled={currentPage * limit >= totalPokemons}>Next</button>
    </div>
  );
}
