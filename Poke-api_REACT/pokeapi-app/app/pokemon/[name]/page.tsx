"use client";

import { useEffect, useState } from "react";
import { use } from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: { [key: string]: string | null };
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

interface Props {
  params: Promise<{ name: string }>; // Ahora es Promise
}

export default function PokemonDetailsPage({ params }: Props) {
  const { name } = use(params); // Desempaqueta el promise
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!res.ok) throw new Error("Pokemon not found");
        const data: Pokemon = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error(error);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [name]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!pokemon) return <p className="text-center mt-4">Pokemon not found</p>;

  return (
    <div className="pokedex_carcasa_2">
      <div className="bordes_2">
        <h2>Sprites:</h2>
        <div className="details-sprites">
          {Object.entries(pokemon.sprites).map(([key, value]) =>
            value ? (
              <div key={key} className="sprite-item">
                <p>{key.replaceAll("_", " ")}</p>
                <img src={value} alt={key} />
              </div>
            ) : null
          )}
        </div>
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
    </div>
  );
}
