interface DarkModeToggleProperties {

  toggleDarkMode: () => void;
}


export const DarkModeToggle: React.FC<DarkModeToggleProperties> = ({ toggleDarkMode }) => {

  return(
    <>
      <p className="pokedex-text"> Dark Mode </p>
      <label className="switch">
          <input type="checkbox" id="dark-mode-toggle" onChange={toggleDarkMode}/>
          <span className="slider"></span>
      </label>
    </>
  );

}