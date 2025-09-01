import Link from "next/link";
import Image from "next/image";
import { Pokemon } from "../../page";

interface PokemonListCardsProperties {

  pokemonList: Pokemon[];
}

export const PokemonListCards: React.FC<PokemonListCardsProperties> = ({pokemonList}) => {

  return(
    <div id="pokemon-list" className="pokemon-list">
        {pokemonList.map((pokemon) => (
            <div
            key={pokemon.id}
            className="pokemon-list-item">
                <Link href={`/details/?searchValue=${pokemon.name}`} passHref>
                    <p className="pokemon-names">{pokemon.name}</p>
                        {pokemon.sprites.front_default ? (<Image
                            className="pokemon-sprite"
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            width={400}
                            height={400}/>
                        ) : (
                            <p>IMAGE NOT FOUND</p>
                        )}
                            <p className="pokemon-types">
                                {pokemon.types.map((type, index) => (
                                    <span key={index}>{`${type.type.name}, `}</span>
                                ))}
                            </p>
                </Link>
            </div>
        ))}
    </div>
  );
}