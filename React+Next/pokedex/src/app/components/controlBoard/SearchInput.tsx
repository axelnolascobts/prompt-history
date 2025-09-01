interface SearchInputProperties {

  darkMode: boolean;
  changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchInput: () => void;
}


export const SearchInput: React.FC<SearchInputProperties> = ({darkMode, changeInput, searchInput}) => {

  return(
    <>
      <form id="pokemon-form" className="pokemon-form">
          <input type="text" name="pokemon" id="pokemon" className={`pokemon ${darkMode ? 'dark-mode' : 'light-mode'}`}
          onChange={changeInput}/>
      </form>
      <section id="button-container" className="button-container">
          <button id="search-button" className="search-button"
          onClick={() => {searchInput()}}></button>
      </section>
    </>
  );

}