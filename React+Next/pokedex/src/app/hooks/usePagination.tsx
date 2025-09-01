import { useState, useEffect } from 'react';

interface UsePaginationProps {
  
  baseUrl: string;
  limit: number;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  totalPokemons: number;
  pokemonType: number; 
  loadPokemonData: (url: string) => void;
  getPokemonByType: (url: string) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

interface UsePaginationReturn {

  auxiliarCurrentPage: number;
  buttonNext: () => void;
  buttonPrevious: () => void;
  updatePagination: () => void;
}

export const usePagination = ({ baseUrl, limit, offset, setOffset, totalPokemons, pokemonType, loadPokemonData, 
    getPokemonByType }: UsePaginationProps): UsePaginationReturn => {

  const [auxiliarCurrentPage, setCurrentPage] = useState<number>(1);

  const paginationWithoutFilter = async () => {

    const url = `${baseUrl}pokemon?limit=${limit}&offset=${offset}`;
    loadPokemonData(url);
  };

  const paginationWithTypeFilter = async () => {

    const url = `${baseUrl}type/${pokemonType}/`;
    getPokemonByType(url);
  };

  const buttonNext = () => {

    if (offset + limit < totalPokemons) {
      setOffset(offset + limit);
    }
  };

  const buttonPrevious = () => {

    if (offset > 0) {
      setOffset(Math.max(offset - limit, 0));
    }
  };

  useEffect(() => {

    setCurrentPage(Math.floor(offset / limit) + 1);
    updatePagination();
  }, [offset, limit]);

  const updatePagination = () => {

    if ( pokemonType < 1 ) {
      paginationWithoutFilter();

    } else {
      paginationWithTypeFilter();
    }
  };

  return { auxiliarCurrentPage, buttonNext, buttonPrevious, updatePagination };
};
