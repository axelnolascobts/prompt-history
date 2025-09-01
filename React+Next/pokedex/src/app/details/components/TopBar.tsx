import Link from "next/link";
import { PokemonDetails } from "../page"

interface TopBarProperties {

  pokemonDetails: PokemonDetails;
}

export const TopBar: React.FC<TopBarProperties> = ({ pokemonDetails }) => {

  return(
    
    <section id="top-bar" className="top-bar">
        <article id="back-button" className="back-button">
            <Link href="/">BACK</Link>
        </article>
        <article id="pokemon-title" className="pokemon-title">
            <p id="pokemon-big-name" className="pokemon-big-name">{pokemonDetails.name.toUpperCase()}</p>
            <p id="pokemon-id" className="pokemon-id">POKEDEX NUMBER: {pokemonDetails.id}</p>
        </article>
    </section>
  );
}