import React from "react";
import Image from "next/image";


interface PokemonGridProps {
  pokemons: Pokemon[];
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface PokemonGridProps {
  pokemons: Pokemon[];
}


export default function PokemonGrid({ pokemons }: PokemonGridProps) {
  return (
    <div id="pokemonGrid" className="pokemonGrid">
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} className="card">
          <div className="img-container">
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={100} 
              height={100}
            />
          </div>
          <p className="font-bold">{pokemon.name}</p>
          <p>
            Types:{" "}
            {pokemon.types
              .map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
