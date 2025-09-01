import { Type } from "../../page";
import { SearchInput } from "./SearchInput";
import { Filters } from "./Filters";
import { DarkModeToggle } from "./DarkModeToggle";
import { Pagination } from "./Pagination"

interface ControlBoardProperties {

    darkMode: boolean;
    toggleDarkMode: () => void;
    paginationValue: number;
    changePokemonQuantity: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    numberOfPages: number;
    types: Type[];
    changePokemonType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    pokemonType: number;
    typeFilter: () => void;
    changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchInput: () => void;
    buttonPrevious: () => void;
    buttonNext: () => void;
    currentPage: number;
}


export const ControlBoard:  React.FC<ControlBoardProperties> = ({ darkMode, toggleDarkMode, paginationValue,
    changePokemonQuantity, numberOfPages, types, changePokemonType, pokemonType,
    typeFilter, changeInput, searchInput, buttonPrevious, buttonNext, currentPage }) => {

  return (
    <section id="pokedex-container" className={`pokedex-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <section id="form-container" className="form-container">

            <SearchInput darkMode={darkMode} changeInput={changeInput} searchInput={searchInput}/>

            <Filters pokemonType={pokemonType} changePokemonType={changePokemonType} types={types}
            paginationValue={paginationValue} changePokemonQuantity={changePokemonQuantity} 
            typeFilter={typeFilter}/>
        </section>

        <DarkModeToggle toggleDarkMode={toggleDarkMode}/>
        
        <Pagination buttonPrevious={buttonPrevious} buttonNext={buttonNext}
        numberOfPages={numberOfPages} currentPage={currentPage}/>

        
    </section>
  );
}
