"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";


// Interfaz principal del Pokémon
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


// Para guardar el nombre y URL de cada sprite
interface SpriteInfo {
  name: string;
  url: string;
}

// Props para recibir el nombre del Pokémon
interface Props {
  params: Promise<{ name: string }>;
}

export default function PokemonDetailsPage({ params }: Props) {
  const { name } = use(params);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();


  /**
   * Función para extraer todos los sprites de un Pokémon
   * @param sprites - objeto de sprites del Pokémon
   * @returns lista de sprites con nombre y URL
   */
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


  // Fetch del Pokémon al cargar la página
  useEffect(() => {
    const controller = new AbortController();
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
      return () => controller.abort();
    };
    fetchPokemon();
  }, [name]);

  // Mostrar loading o mensaje si no hay Pokémon
  if (loading) return <p className="loader">Loading...</p>;
  if (!pokemon) return <p className="loader">Pokemon not found</p>;

  const spriteList = extractSprites(pokemon.sprites);


  return (
    <div className={`pokedex_carcasa_2 ${darkMode ? "dark-mode" : ""}`}>
      
      {/* Botones de navegación y modo oscuro */}
      <div className="controls-container">
        <button className="back_button" onClick={() => router.back()}>
          Back
        </button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

        {/* Información del Pokémon */}
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

      {/* Contenedor principal de información */}
      <div className="bordes_2">
        {/* Sprites */}
        <h2>Sprites:</h2>
        <div className="details-sprites">
          {spriteList.map((sprite) => (
            <div key={sprite.name} className="sprite-item">
              <p>{sprite.name}</p>
              <Image
               src={sprite.url}
              alt={sprite.name}
              width={65}
              height={65} />
            </div>
          ))}
        </div>




      </div>
    </div>
  );
}
