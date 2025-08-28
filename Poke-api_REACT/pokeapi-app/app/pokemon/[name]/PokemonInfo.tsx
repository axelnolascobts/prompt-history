import React from "react";

interface Pokemon {
  name: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

interface Props {
  pokemon: Pokemon;
}

export default function PokemonInfo({ pokemon }: Props) {
  return (
    <div className="bordes_2">
      <h2>Name:</h2>
      <p>{pokemon.name}</p>

      <h2>Type(s):</h2>
      <p>{pokemon.types.map((t) => t.type.name).join(", ")}</p>

      <h2>Height:</h2>
      <p>{pokemon.height}</p>

      <h2>Weight:</h2>
      <p>{pokemon.weight}</p>

      <h2>Ability(s):</h2>
      <p>{pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
    </div>
  );
}
