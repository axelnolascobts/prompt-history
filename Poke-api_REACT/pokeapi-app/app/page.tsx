"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import PokemonCard from "@/components/PokemonCard";
import Link from "next/link";

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
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPokemons, setTotalPokemons] = useState<number>(0);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const [isPending, startTransition] = useTransition();

  const fetchTypes = useCallback(async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      setTypes(data.results.map((t: PokemonType) => t.name));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchPokemons = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * limit;

      if (selectedType) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        const data: { pokemon: { pokemon: PokemonListResult }[] } = await res.json();
        const subset = data.pokemon.slice(offset, offset + limit);
        const responses = await Promise.all(subset.map((p) => fetch(p.pokemon.url)));
        const details: Pokemon[] = await Promise.all(responses.map((r) => r.json()));
        startTransition(() => {
          setPokemons(details);
          setTotalPokemons(data.pokemon.length);
        });
      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data: { count: number; results: PokemonListResult[] } = await res.json();
        const responses = await Promise.all(data.results.map((p) => fetch(p.url)));
        const details: Pokemon[] = await Promise.all(responses.map((r) => r.json()));
        startTransition(() => {
          setPokemons(details);
          setTotalPokemons(data.count);
        });
      }
      setSearchActive(false);
    } catch (err) {
      console.error(err);
      startTransition(() => {
        setPokemons([]);
        setTotalPokemons(0);
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, selectedType]);

  const handleSearch = async () => {
    if (!searchTerm) return fetchPokemons();
    try {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokemon not found");
      const data: Pokemon = await res.json();
      startTransition(() => {
        setPokemons([data]);
        setTotalPokemons(1);
        setSearchActive(true);
      });
    } catch (err) {
      console.error(err);
      startTransition(() => {
        setPokemons([]);
        setTotalPokemons(0);
        setSearchActive(true);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
    fetchPokemons();
  }, [fetchTypes, fetchPokemons]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => (prev * limit < totalPokemons ? prev + 1 : prev));

  const handleLimitChange = (newLimit: number) => {
    const firstIndex = (currentPage - 1) * limit;
    const newPage = Math.floor(firstIndex / newLimit) + 1;
    setLimit(newLimit);
    setCurrentPage(newPage);
  };

  return (
    <div
      className={`pokedex_carcasa ${darkMode ? "dark-mode" : ""}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Controles */}
      <div className="controls-container">
        <input
          className="input_field"
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search" onClick={handleSearch}></button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} Pokémon
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div id="pokemonGrid" className="pokemonGrid">
        {loading || isPending ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <svg
              fill={darkMode ? "#ffffff" : "#000000"}
              height="200px"
              width="200px"
              viewBox="0 0 330 330"
            >
              <g>
                <path d="M165,232.5c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15s15-6.716,15-15v-60C180,239.216,173.284,232.5,165,232.5z"/>
                <path d="M165,7.5c-8.284,0-15,6.716-15,15v30c0,8.284,6.716,15,15,15s15-6.716,15-15v-30C180,14.216,173.284,7.5,165,7.5z"/>
                <path d="M90,157.5c0-8.284-6.716-15-15-15H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h60C83.284,172.5,90,165.784,90,157.5z"/>
                <path d="M315,142.5h-60c-8.284,0-15,6.716-15,15s6.716,15,15,15h60c8.284,0,15-6.716,15-15S323.284,142.5,315,142.5z"/>
                <path d="M90.752,210.533L48.327,252.96c-5.857,5.858-5.857,15.355,0,21.213c2.929,2.929,6.768,4.393,10.607,4.393s7.678-1.464,10.607-4.393l42.426-42.427c5.857-5.858,5.857-15.355-0.001-21.213C106.108,204.675,96.611,204.675,90.752,210.533z"/>
                <path d="M228.639,108.86c3.839,0,7.678-1.464,10.606-4.394l42.426-42.427c5.858-5.858,5.858-15.355,0-21.213c-5.857-5.857-15.355-5.858-21.213,0l-42.426,42.427c-5.858,5.858-5.858,15.355,0,21.213C220.961,107.396,224.8,108.86,228.639,108.86z"/>
                <path d="M239.245,210.533c-5.856-5.857-15.355-5.858-21.213-0.001c-5.858,5.858-5.858,15.355,0,21.213l42.426,42.427c2.929,2.929,6.768,4.393,10.607,4.393c3.838,0,7.678-1.465,10.606-4.393c5.858-5.858,5.858-15.355,0-21.213L239.245,210.533z"/>
              </g>
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
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage * limit >= totalPokemons}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
