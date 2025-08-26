"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";

interface Pokemon {
  id: number;
  name: string;
  sprites: Sprites;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

// Interfaz recursiva para los sprites
interface Sprites {
  [key: string]: string | Sprites | null;
}

// Para guardar la URL y su nombre
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

  // Extrae todos los sprites recursivamente con su nombre
  const extractSprites = (sprites: Sprites): SpriteInfo[] => {
    const result: SpriteInfo[] = [];
    const traverse = (obj: Sprites, prefix = "") => {
      Object.entries(obj).forEach(([key, val]) => {
        const name = prefix ? `${prefix} ${key}` : key;
        if (typeof val === "string" && val) result.push({ name, url: val });
        else if (val && typeof val === "object") traverse(val as Sprites, name);
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

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!pokemon) return <p className="text-center mt-4">Pokemon not found</p>;

  const spriteList = extractSprites(pokemon.sprites);

  return (
    <div
      className={`pokedex_carcasa_2 ${darkMode ? "dark-mode" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <button
        className="back_button"
        style={{ marginBottom: "1rem" }}
        onClick={() => router.back()}
      >
        Back
      </button>

      <button
        style={{ marginBottom: "1rem" }}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div
        className="bordes_2"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          padding: "1rem",
        }}
      >
        <h2>Sprites:</h2>
        <div
          className="details-sprites"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {spriteList.map((sprite) => (
            <div
              key={sprite.name}
              className="sprite-item"
              style={{ textAlign: "center" }}
            >
              <p>{sprite.name.replaceAll("_", " ")}</p>
              <img src={sprite.url} alt={sprite.name} />
            </div>
          ))}
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
