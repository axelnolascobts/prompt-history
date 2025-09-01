import Image from "next/image";
import { PokemonDetails } from "../page"

interface SpritesSectionProperties {

  pokemonDetails: PokemonDetails;
}

export const SpritesSection: React.FC<SpritesSectionProperties> = ({ pokemonDetails }) => {

  return(
    
    <section id="sprites-grid" className="sprites-grid">
        {Object.values(pokemonDetails.sprites)
        .filter((sprite) => typeof sprite === "string")
        .map((sprite, index) => (
            <Image key={index} className="pokemon-sprite"
            src={sprite}
            alt={pokemonDetails.name}
            width={400}
            height={400}/>
        ))}
    </section>
  );
}