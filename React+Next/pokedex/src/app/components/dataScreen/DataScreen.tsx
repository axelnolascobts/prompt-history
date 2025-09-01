import { Pokemon } from "../../page";
import { SinglePokemonCard } from "./SinglePokemonCard";
import { PokemonListCards } from "./PokemonListCards";

interface DataScreenProperties {
    darkMode: boolean;
    loading: boolean;
    error: string | null;
    pokemonList: Pokemon[];
}

export const DataScreen:  React.FC<DataScreenProperties> = ({ darkMode, loading, 
    error, pokemonList }) => {

  return (
    <section id="list-container" className={`list-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <section id="list-screen" className="list-screen">
            <article id="right-screen" className="right-screen">

                {loading && (
                    <div id="loading-message" className="loading-message" style={{ display: 'flex' }}>
                    <p>Loading...</p>
                    </div>
                )}

                {error && (
                    <div id="error-message" className="error-message" style={{ display: 'flex' }}>
                    <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    pokemonList.length === 1 ? (
                        
                        <SinglePokemonCard pokemonData={pokemonList}/>
                    ) : (

                        <PokemonListCards pokemonList={pokemonList}/>
                    )
                )}
            </article>
        </section>
    </section>
  );
}
