import Link from "next/link";
import Image from "next/image";
import { Pokemon } from "../../page";

interface SinglePokemonCardProperties {

  pokemonData: Pokemon[];
}

export const SinglePokemonCard: React.FC<SinglePokemonCardProperties> = ({pokemonData}) => {

  return(
    <div id="single-pokemon" className="single-pokemon">
        <div className="pokemon-list-item">
            <Link href={`/details/?searchValue=${pokemonData[0].name}`} passHref>
                <p className="pokemon-names-single">{pokemonData[0].name}</p>
                {pokemonData[0].sprites.front_default ? (
                    <Image
                        className="pokemon-sprite"
                        src={pokemonData[0].sprites.front_default}
                        alt={pokemonData[0].name}
                        width={400}
                        height={400}
                    />
                ) : (
                    <p>IMAGE NOT FOUND</p>
                )}
                <p className="pokemon-types-single">
                {pokemonData[0].types.map((type, index) => (
                    <span key={index}>{`${type.type.name}, `}</span>
                ))}
                </p>
            </Link>
        </div>
    </div>
  );
}