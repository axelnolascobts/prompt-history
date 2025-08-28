// hooks/usePokemonTypes.ts
import { useState, useEffect } from "react";

interface PokemonType {
  name: string;
  url: string;
}

export function usePokemonTypes() {
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data = await res.json();
        setTypes(data.results.map((t: PokemonType) => t.name));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, []);

  return types;
}
