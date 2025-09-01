// "use server";
import { useState, useCallback, useRef, useTransition } from "react";

// Interfaces
interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

interface PokemonListResult {
  name: string;
  url: string;
}

// Hook personalizado
export function usePokemons(limit: number, selectedType: string, currentPage: number) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  
  const fetchPokemonSafe = async (url: string): Promise<Pokemon | null> => {
    const urlsToTry = [url, url.replace(/\/$/, "")]; 
    for (const u of urlsToTry) {
      try {
        const res = await fetch(u, { signal: abortRef.current?.signal });
        if (!res.ok) throw new Error(`Invalid response: ${res.status}`);
        const data: Pokemon = await res.json();
        return data;
      } catch {}
    }
    console.warn(`Failed to fetch Pokémon at ${url}`);
    return null;
  };

  const fetchPokemons = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setPokemons([]);
      const offset = (currentPage - 1) * limit;

      if (selectedType) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, { signal: controller.signal });
        const data: { pokemon: { pokemon: PokemonListResult }[] } = await res.json();
        const subset = data.pokemon.slice(offset, offset + limit);

        const details = await Promise.all(subset.map(p => fetchPokemonSafe(p.pokemon.url)));
        const validDetails = details.filter((d): d is Pokemon => d !== null);

        startTransition(() => {
          setPokemons(validDetails);
          setTotalPokemons(data.pokemon.length);
        });

      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`, { signal: controller.signal });
        const data: { count: number; results: PokemonListResult[] } = await res.json();

        const details = await Promise.all(data.results.map(p => fetchPokemonSafe(p.url)));
        const validDetails = details.filter((d): d is Pokemon => d !== null);

        startTransition(() => {
          setPokemons(validDetails);
          setTotalPokemons(data.count);
        });
      }

      setSearchActive(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
        startTransition(() => {
          setPokemons([]);
          setTotalPokemons(0);
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, selectedType]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return fetchPokemons();

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setPokemons([]);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`, { signal: controller.signal });
      if (!res.ok) throw new Error("Pokemon not found");
      const data: Pokemon = await res.json();

      startTransition(() => {
        setPokemons([data]);
        setTotalPokemons(1);
        setSearchActive(true);
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
        startTransition(() => {
          setPokemons([]);
          setTotalPokemons(0);
          setSearchActive(true);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return { pokemons, totalPokemons, loading, isPending, searchActive, fetchPokemons, handleSearch };
}
