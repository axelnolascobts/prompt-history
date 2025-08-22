"use client";
import { useEffect, useState } from "react";
import Controls from "@/components/Controls";
import PokemonGrid from "@/components/PokemonGrid";

export default function Home() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [totalPokemons, setTotalPokemons] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Pokémon types
  const fetchTypes = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      const typeNames = data.results.map((t: any) => t.name);
      setTypes(typeNames);
    } catch (error) {
      console.error("Error loading types:", error);
    }
  };

  // Fetch Pokémon list
  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

      if (selectedType) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        const data = await res.json();
        const subset = data.pokemon.slice(offset, offset + limit);
        const requests = subset.map((p: any) => fetch(p.pokemon.url));
        const responses = await Promise.all(requests);
        const details = await Promise.all(responses.map((r) => r.json()));
        setPokemons(details);
        setTotalPokemons(data.pokemon.length);
      } else {
        const res = await fetch(url);
        const data = await res.json();
        setTotalPokemons(data.count);
        const requests = data.results.map((p: any) => fetch(p.url));
        const responses = await Promise.all(requests);
        const details = await Promise.all(responses.map((r) => r.json()));
        setPokemons(details);
      }
    } catch (error) {
      console.error("Error loading Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchSinglePokemon(searchTerm);
    } else {
      fetchPokemons();
    }
  }, [selectedType, limit, currentPage, searchTerm]);

  const fetchSinglePokemon = async (name: string) => {
    try {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokemon not found");
      const data = await res.json();
      setPokemons([data]);
      setTotalPokemons(1);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>
      <Controls
        types={types}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        limit={limit}
        setLimit={setLimit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPokemons={totalPokemons}
      />
      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : (
        <PokemonGrid pokemons={pokemons} />
      )}
    </main>
  );
}
