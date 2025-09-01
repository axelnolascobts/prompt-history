
interface UseFilterProps {
  
  baseUrl: string;
  auxiliarLimit: number;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setTotalPokemons: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loadPokemonData: (url: string) => void;
  getPokemonByType: (url: string) => void;
  pokemonType: number;
}

export const useFilter = ({ baseUrl, auxiliarLimit, offset, setOffset, setLimit, setTotalPokemons,
  setCurrentPage, loadPokemonData, getPokemonByType, pokemonType }: UseFilterProps) => {

  const typeFilter = () => {

    setLimit(auxiliarLimit); 
    setCurrentPage(1);
    setOffset(0);

    if (pokemonType < 1) {

      setTotalPokemons(1302);
      const url = `${baseUrl}pokemon/?limit=${auxiliarLimit}&offset=${offset}`;
      loadPokemonData(url);

    } else {

      const url = `${baseUrl}type/${pokemonType}/`;
      getPokemonByType(url);
    }
  };

  return { typeFilter };
};
