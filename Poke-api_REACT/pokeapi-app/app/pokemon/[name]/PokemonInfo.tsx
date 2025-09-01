import React from "react";

interface Pokemon {
  id: number
  name: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

interface Props {
  pokemonData: Pokemon;
}

export default function PokemonInfo({ pokemonData }: Props) {
  return (
    <div className="bordes_2">
      <h2>Number in the Pokedex:</h2>
      <p>{pokemonData.id}</p>

      <h2>Name:</h2>
      <p>{pokemonData.name}</p>

      <h2>Type(s):</h2>
      <p>{pokemonData.types.map((t) => t.type.name).join(", ")}</p>

      <h2>Height:</h2>
      <p>{pokemonData.height}</p>

      <h2>Weight:</h2>
      <p>{pokemonData.weight}</p>

      <h2>Ability(s):</h2>
      <p>{pokemonData.abilities.map((a) => a.ability.name).join(", ")}</p>
    </div>
  );
}
