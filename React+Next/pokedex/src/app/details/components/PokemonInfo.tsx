
import { PokemonDetails } from "../page"

interface PokemonInfoProperties {

  pokemonDetails: PokemonDetails;
}

export const PokemonInfo: React.FC<PokemonInfoProperties> = ({ pokemonDetails }) => {

  return(
    
    <section id="more-details" className="more-details">
      <p id="pokemon-types">
        TYPE(S): {pokemonDetails.types.map((type) => type.type.name).join(", ")}
      </p>
        <p id="pokemon-height">HEIGHT: {pokemonDetails.height / 10} m</p>
        <p id="pokemon-weight">WEIGHT: {pokemonDetails.weight / 10} kg</p>
    </section>
  );
}