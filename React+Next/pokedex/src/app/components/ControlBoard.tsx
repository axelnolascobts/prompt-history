import { Type } from "../page";

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
            <form id="pokemon-form" className="pokemon-form">
                <input type="text" name="pokemon" id="pokemon" className={`pokemon ${darkMode ? 'dark-mode' : 'light-mode'}`}
                onChange={changeInput}/>
            </form>
            <section id="button-container" className="button-container">
                <button id="search-button" className="search-button"
                onClick={() => {searchInput()}}></button>
            </section>
            <form id="pokedex-settings" className="pokedex-settings">

                <select name="Type" id="type-selector" 
                required
                value={pokemonType}
                onChange={changePokemonType}>
                    <option value="" disabled>Filter with type</option>
                    <option value="">None</option>
                    {types.map((type, index) => (
                        <option key={index} value={index + 1} className="pokemon-type-option">
                            {type.name}
                        </option>
                    ))}
                </select>

                <select name="pagination" id="pagination-selector"
                required
                value={paginationValue}
                onChange={changePokemonQuantity}>

                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </form>

            <section id="filter-button-container" className="button-container">
                <button id="filter-button" className="search-button"
                onClick={() => {typeFilter()}}></button>
            </section>
        </section>

        <label className="switch">
            <input type="checkbox" id="dark-mode-toggle" onChange={toggleDarkMode}/>
            <span className="slider"></span>
        </label>

        <section className="pagination-container">
            <button id="button-previous" className="pagination-button"
            onClick={buttonPrevious}> {`<-`} </button>
            <button className="pagination-button"> {numberOfPages} </button>
            <button id="button-next" className="pagination-button"
            onClick={buttonNext}> {`->`} </button>
        </section>

        <label>
            <p id="current-page">Current page: {currentPage}</p>
        </label>
    </section>
  );
}
