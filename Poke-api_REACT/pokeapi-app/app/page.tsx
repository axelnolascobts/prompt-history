"use client";
import React, { useState, useEffect } from "react";
import Controls from "@/components/Controls"
import PokemonGrid from "@/components/PokemonGrid";
import { usePokemons } from "@/app/hooks/usePokemons";

interface PokemonType {
  name: string;
  url: string;
}

interface PokemonTypeApiResponse {
  results: PokemonType[];
}

export default function HomePage() {
  // Estados de UI
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [darkMode, setDarkMode] = useState(false);

  // Hook personalizado para manejar fetch y búsqueda
  const { pokemons, totalPokemons, loading, isPending, searchActive, fetchPokemons, handleSearch } =
    usePokemons(limit, selectedType, currentPage);

  // Cargar tipos de Pokémon al montar
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data: PokemonTypeApiResponse = await res.json();
        setTypes(data.results.map((t) => t.name));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, []);

  // Refrescar pokemons al cambiar página, límite o tipo
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  // Funciones de paginación
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => (prev * limit < totalPokemons ? prev + 1 : prev));
  const handleLimitChange = (newLimit: number) => {
    const firstIndex = (currentPage - 1) * limit;
    const newPage = Math.floor(firstIndex / newLimit) + 1;
    setLimit(newLimit);
    setCurrentPage(newPage);
  };

  return (
    <div className={`pokedex_case ${darkMode ? "dark-mode" : ""}`} style={{ minHeight: "100vh", padding: "1rem" }}>
      {/* Controles */}
      <Controls
        types={types}
        selectedType={selectedType}
        setSelectedType={(val) => { setSelectedType(val); setCurrentPage(1); }}
        limit={limit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPokemons={totalPokemons}
        handleLimitChange={handleLimitChange}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
      />

      {/* Grid de Pokémon */}
      <PokemonGrid pokemons={pokemons} loading={loading} isPending={isPending} darkMode={darkMode} />

      {/* Toggle modo oscuro */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mt-4 px-4 py-2 border rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
