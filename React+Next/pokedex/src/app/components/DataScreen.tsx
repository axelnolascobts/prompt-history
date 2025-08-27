import Link from "next/link";
import { Pokemon } from "../page";

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
                    <div id="error-message" className="error-message">
                    <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    pokemonList.length === 1 ? (
                        <div id="single-pokemon" className="single-pokemon">
                            <div className="pokemon-list-item">
                                <Link href={`/details/?searchValue=${pokemonList[0].name}`} passHref>
                                    <p className="pokemon-names-single">{pokemonList[0].name}</p>
                                    <img
                                        className="pokemon-sprite"
                                        src={pokemonList[0].sprites.front_default}
                                    />
                                    <p className="pokemon-types-single">
                                        {pokemonList[0].types.map((type, index) => (
                                            <span key={index}>{type.type.name}</span>
                                        ))}
                                    </p>
                                </Link>
                            </div>
                        </div>

                    ) : (
                        <div id="pokemon-list" className="pokemon-list">
                            {pokemonList.map((pokemon) => (
                                <div
                                key={pokemon.id}
                                className="pokemon-list-item"
                                >
                                    <Link href={`/details/?searchValue=${pokemon.name}`} passHref>
                                        <p className="pokemon-names">{pokemon.name}</p>
                                        <img
                                            className="pokemon-sprite"
                                            src={pokemon.sprites.front_default}
                                        />
                                        <p className="pokemon-types">
                                            {pokemon.types.map((type, index) => (
                                            <span key={index}>{type.type.name}</span>
                                            ))}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </article>
        </section>
    </section>
  );
}
