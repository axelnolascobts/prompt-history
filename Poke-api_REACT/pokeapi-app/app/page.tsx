"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import PokemonGrid from "@/components/PokemonGrid";
import Footer from "@/components/Footer";
import { usePokemons } from "@/app/hooks/usePokemons";
import { usePokemonTypes } from "@/app/hooks/usePokemonTypes";
import { useDarkMode } from "../components/Darkmode";
import { usePagination } from "@/app/hooks/usePagination";

export default function HomePage() {
  const types = usePokemonTypes();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const { currentPage, limit, setCurrentPage, handlePrevPage, handleNextPage,
     handleLimitChange, setTotalItems } =
    usePagination(0, 5);

  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { pokemons, totalPokemons, loading, isPending, searchActive, fetchPokemons, handleSearch } =
    usePokemons(limit, selectedType, currentPage);

  // sincronizar totalItems de la paginación con totalPokemons
  useEffect(() => {
    setTotalItems(totalPokemons);
  }, [totalPokemons, setTotalItems]);

  // fetch de pokemons al cambiar filtros
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  return (
    <div className={`pokedex_case ${darkMode ? "dark-mode" : ""}`}>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        types={types}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        limit={limit}
        handleLimitChange={handleLimitChange}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <PokemonGrid
        pokemons={pokemons}
        loading={loading}
        isPending={isPending}
        darkMode={darkMode}
      />

      <Footer
        currentPage={currentPage}
        totalPokemons={totalPokemons}
        limit={limit}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        searchActive={searchActive}
      />
    </div>
  );
}
