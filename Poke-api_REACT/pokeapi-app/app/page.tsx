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
      <div
        className="controls-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
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
      <div
        id="pokemonGrid"
        className="pokemonGrid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          width: "100%",
          maxWidth: "1200px",
          justifyContent: searchActive ? "center" : "start",
        }}
      >
        {loading || isPending ? (
          <p className="loader" style={{ textAlign: "center", width: "100%" }}>
            Loading...
          </p>
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
        <div
          id="paginationContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
            marginBottom: "2rem",
            width: "100%",
          }}
        >
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
