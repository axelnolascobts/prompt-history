"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PokemonInfo from "./PokemonInfo";
import PokemonSprites from "./PokemonSprites";
import DarkModeToggle from "./DarkModeToggle";

interface Pokemon {
  id: number;
  name: string;
  sprites: Sprites;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

interface Sprites {
  [key: string]: string | Sprites | null;
}

interface SpriteInfo {
  name: string;
  url: string;
}

interface Props {
  params: Promise<{ name: string }>;
}

export default function PokemonDetailsPage({ params }: Props) {
  const { name } = use(params);

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  //aplana los sprites y los va guardando
  const extractSprites = (sprites: Sprites): SpriteInfo[] => {
    const result: SpriteInfo[] = [];
    const traverse = (obj: Sprites, prefix = "") => {
      Object.entries(obj).forEach(([key, val]) => {
        const spriteName = prefix ? `${prefix} ${key}` : key;
        if (typeof val === "string" && val) result.push({ name: spriteName, url: val });
        else if (val && typeof val === "object") traverse(val as Sprites, spriteName);
      });
    };
    traverse(sprites);
    return result;
  };

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

  if (loading) return <p className="loader">Loading...</p>;
  if (!pokemon) return <p className="loader">Pokemon not found</p>;

  const spriteList = extractSprites(pokemon.sprites);

  return (
    <div className={`pokedex_case ${darkMode ? "dark-mode" : ""}`}>
      <div className="controls-container">
        <button className="back_button" onClick={() => router.back()}>
          Back
        </button>
        <DarkModeToggle darkMode={darkMode} toggle={() => setDarkMode(!darkMode)} />
      </div>

      <PokemonInfo pokemonData={pokemon} />
      <PokemonSprites spriteList={spriteList} />
    </div>
  );
}
