import React from "react";
import Image from "next/image";

// Estructura esperada de un Pokémon
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string; // Imagen principal del Pokémon
  };
  types: {
    type: {
      name: string; // Nombre del tipo
    };
  }[];
}

// Props que recibe el componente: lista de Pokémon
interface PokemonGridProps {
  pokemons: Pokemon[];
}

// Componente que renderiza un grid de tarjetas de Pokémon
export default function PokemonGrid({ pokemons }: PokemonGridProps) {
  return (
    <div id="pokemonGrid" className="pokemonGrid">
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} className="card transition-colors duration-300">
          {/* Contenedor de imagen para centrar la sprite */}
          <div className="img-container">
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={100}
              height={100}
              loading="lazy"
              
            />
          </div>

          {/* Nombre del Pokémon */}
          <p className="font-bold">{pokemon.name}</p>

          {/* Tipos del Pokémon */}
          <p>
            Types:{" "}
            {pokemon.types
              .map(
                (t) =>
                  t.type.name.charAt(0).toUpperCase() +
                  t.type.name.slice(1) // Capitaliza la primera letra
              )
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
