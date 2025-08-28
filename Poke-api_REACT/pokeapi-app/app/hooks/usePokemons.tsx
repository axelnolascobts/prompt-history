import { useState, useCallback, useRef, useTransition } from "react";

// Interfaces para tipar los Pokémon y resultados de la API
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

// Hook personalizado para manejar la obtención de Pokémon, filtrado y búsqueda
export function usePokemons(limit: number, selectedType: string, currentPage: number) {
  // Estado para almacenar los Pokémon cargados
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  // Estado para saber el total de Pokémon disponibles según filtros
  const [totalPokemons, setTotalPokemons] = useState(0);
  // Estado de carga para mostrar spinners o skeletons
  const [loading, setLoading] = useState(false);
  // Indica si se está mostrando un resultado de búsqueda directa
  const [searchActive, setSearchActive] = useState(false);
  // React 18: transición para actualizar UI sin bloquear render
  const [isPending, startTransition] = useTransition();
  // Referencia al AbortController para cancelar fetch anteriores
  const abortRef = useRef<AbortController | null>(null);

  // Función para obtener Pokémon desde la API
  const fetchPokemons = useCallback(async () => {
    // Si hay una petición anterior, la abortamos
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true); // activa el loader
      setPokemons([]);  // limpia la lista mientras se carga
      const offset = (currentPage - 1) * limit; // calcula desde qué índice obtener Pokémon

      if (selectedType) {
        // Si hay filtro por tipo, obtenemos los Pokémon de ese tipo
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, 
          { signal: controller.signal });
        const data: { pokemon: { pokemon: PokemonListResult }[] } = await res.json();

        // Tomamos solo los Pokémon de la página actual
        const subset = data.pokemon.slice(offset, offset + limit);

        // Hacemos fetch de los detalles completos de cada Pokémon
        const responses = await Promise.all(subset.map((p) => fetch(p.pokemon.url,
           { signal: controller.signal })));
        const details: Pokemon[] = await Promise.all(responses.map((r) => r.json()));

        // Actualizamos el estado dentro de una transición para no bloquear la UI
        startTransition(() => {
          setPokemons(details);
          setTotalPokemons(data.pokemon.length);
        });

      } else {
        // Si no hay filtro por tipo, obtenemos la lista general
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
           { signal: controller.signal });
        const data: { count: number; results: PokemonListResult[] } = await res.json();

        // Fetch de detalles completos de cada Pokémon
        const responses = await Promise.all(data.results.map((p) => fetch(p.url,
           { signal: controller.signal })));
        const details: Pokemon[] = await Promise.all(responses.map((r) => r.json()));

        // Actualizamos la lista dentro de una transición
        startTransition(() => {
          setPokemons(details);
          setTotalPokemons(data.count);
        });
      }

      setSearchActive(false); // no estamos en modo búsqueda directa
    } catch (err) {
      if ((err as Error).name !== "AbortError") { // ignoramos aborts
        console.error(err);
        startTransition(() => {
          setPokemons([]);
          setTotalPokemons(0);
        });
      }
    } finally {
      setLoading(false); // desactiva loader
    }
  }, [currentPage, limit, selectedType]);

  // Función para buscar un Pokémon por nombre
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return fetchPokemons(); // si no hay término, usamos fetch normal

    // Cancelamos fetch anterior si existe
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setPokemons([]);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`,
       { signal: controller.signal });
      if (!res.ok) throw new Error("Pokemon not found");
      const data: Pokemon = await res.json();

      // Guardamos el resultado dentro de una transición
      startTransition(() => {
        setPokemons([data]);
        setTotalPokemons(1);
        setSearchActive(true); // indica que estamos en modo búsqueda
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

  // Retornamos todo lo necesario para consumir el hook en un componente
  return { pokemons, totalPokemons, loading, isPending, searchActive, fetchPokemons, handleSearch };
}
