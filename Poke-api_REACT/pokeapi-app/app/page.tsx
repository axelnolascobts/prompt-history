"use client";

import { useEffect, useState, useCallback, useTransition, useRef } from "react";
import PokemonCard from "@/components/PokemonCard";
import Link from "next/link";

// Interfaces para tipos de datos
interface PokemonType {
  name: string;
  url: string;
}

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

export default function HomePage() {
  // Estados para almacenar la información
  const [pokemons, setPokemons] = useState<Pokemon[]>([]); // Lista de Pokémon cargados
  const [types, setTypes] = useState<string[]>([]); // Lista de tipos disponibles
  const [selectedType, setSelectedType] = useState<string>(""); // Tipo seleccionado
  const [searchTerm, setSearchTerm] = useState<string>(""); // Término de búsqueda
  const [currentPage, setCurrentPage] = useState<number>(1); // Página actual
  const [limit, setLimit] = useState<number>(5); // Pokémon por página
  const [totalPokemons, setTotalPokemons] = useState<number>(0); // Total de Pokémon
  const [darkMode, setDarkMode] = useState(false); // Modo oscuro
  const [loading, setLoading] = useState(false); // Estado de carga
  const [searchActive, setSearchActive] = useState(false); // Indica si se hizo búsqueda individual



  // Hooks de transición y referencia para abortar fetch
  const [isPending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);



  // Función para obtener tipos de Pokémon
  const fetchTypes = useCallback(async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      setTypes(data.results.map((t: PokemonType) => t.name));
    } catch (err) {
      console.error(err);
    }
  }, []);



  // Función principal para obtener Pokémon según página, tipo o búsqueda
  const fetchPokemons = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort(); // Cancela fetch anterior
    const controller = new AbortController();
    abortRef.current = controller;


    try {
      setLoading(true);
      setPokemons([]); // Limpia para evitar mostrar datos viejos
      const offset = (currentPage - 1) * limit;


      if (selectedType) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, { signal: controller.signal });
        const data: { pokemon: { pokemon: PokemonListResult }[] } = await res.json();
        const subset = data.pokemon.slice(offset, offset + limit);
        const responses = await Promise.all(subset.map((p) => fetch(p.pokemon.url, { signal: controller.signal })));
        const details: Pokemon[] = await Promise.all(responses.map((r) => r.json()));
        startTransition(() => {
          setPokemons(details);
          setTotalPokemons(data.pokemon.length);
        });


      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        { signal: controller.signal });
          const data: { count: number; results: PokemonListResult[] } = await res.json();
        const responses = await Promise.all(data.results.map((p) => fetch(p.url,
           { signal: controller.signal })));
        const details: Pokemon[] = await Promise.all(responses.map((r) => r.json()));
        startTransition(() => {
          setPokemons(details);
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



  // Función para búsqueda individual
  const handleSearch = async () => {
    if (!searchTerm) return fetchPokemons();

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;


    try {
      setLoading(true);
      setPokemons([]); // Limpia datos anteriores
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`,
       { signal: controller.signal });
      if (!res.ok) throw new Error("Pokemon not found");
      const data: Pokemon = await res.json();
      startTransition(() => {
        setPokemons([data]);
        setTotalPokemons(1);
        setSearchActive(true);
      });
    }

     catch (err) {
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


  // useEffect para cargar datos iniciales
  useEffect(() => {
    fetchTypes();
    fetchPokemons();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchTypes, fetchPokemons]);



  // Funciones de paginación
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => (prev * limit < totalPokemons ? prev + 1 : prev));
  const handleLimitChange = (newLimit: number) => {
    const firstIndex = (currentPage - 1) * limit;
    const newPage = Math.floor(firstIndex / newLimit) + 1;
    setLimit(newLimit);
    setCurrentPage(newPage);
  };



  return (
    <div className={`pokedex_carcasa ${darkMode ? "dark-mode" : ""}`}
     style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }
     }>



      {/* Controles de búsqueda, filtrado y modo */}
      <div className="controls-container">
        <input className="input_field" type="text" placeholder="Search Pokémon" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="search" onClick={handleSearch}></button>
        <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
        <select value={selectedType} onChange={(e) => 
        { setSelectedType(e.target.value); setCurrentPage(1); }}>



          <option value="">All types</option>
          {types.map((type) =>
          (<option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>))}
        </select>

        <select value={limit} onChange={(e) =>
           handleLimitChange(Number(e.target.value))}>
          {[5, 10, 20, 50, 100].map((num) =>
            (<option key={num} value={num}>{num} Pokémon</option>))}
        </select>
      </div>



      {/* Grid de Pokémon con loader */}
 <div id="pokemonGrid" className="pokemonGrid" style={{ position: "relative", minHeight: "300px" }}>
    {loading || isPending ? (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
    >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="200px"
          height="200px"
          stroke={darkMode ? "#ffffff" : "#000000"}
        >
          <path
            d="M12 3V6M3 12H6M5.63607 5.63604L7.75739 7.75736M5.63604 18.3639L7.75736 16.2426M21 12.0005H18M18.364 5.63639L16.2427 7.75771M11.9998 21.0002V18.0002M18.3639 18.3642L16.2426 16.2429"
            stroke={darkMode ? "#ffffff" : "#000000"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
) : (
  pokemons.map((p) => (
    <Link key={p.id} href={`/pokemon/${p.name}`}>
      <PokemonCard poke={p} />
    </Link>
  ))
)}

</div>


      {/* Paginación */}
      {!searchActive && (
        <div id="paginationContainer">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <span>{currentPage}</span>
          <button onClick={handleNextPage} disabled={currentPage * limit >= totalPokemons}>Next</button>
        </div>
      )}
    </div>
  );
}
