import Link from "next/link";
import PokemonCard from "./PokemonCard";
import React from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

interface PokemonGridProps {
  pokemons: Pokemon[];
  loading: boolean;
  isPending: boolean;
  darkMode: boolean;
}

export default function PokemonGrid({ pokemons, loading, isPending, darkMode }: PokemonGridProps) {
  return (
    <div className={`pokemonGrid ${darkMode ? "dark-mode" : ""}`}
     style={{ position: "relative", minHeight: "300px" }}>
      {loading || isPending ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <p>Loading...</p>
        </div>
      ) : (
        pokemons.map((p) => (
          <Link key={p.id} href={`/pokemon/${p.name}`}>
            <PokemonCard poke={p} />
          </Link>
        ))
      )}
    </div>
  );
}

