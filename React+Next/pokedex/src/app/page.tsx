"use client"

import React, { useState, useEffect } from "react";
import { ControlBoard } from "./components/controlBoard/ControlBoard";
import { DataScreen } from "./components/dataScreen/DataScreen";
import { usePagination } from "./hooks/usePagination";
import { useGetPokemon } from "./hooks/useGetPokemon";
import { useDarkMode } from "./hooks/useDarkMode";
import { useFilter } from "./hooks/useFilter";

export interface Pokemon {
  name: string;
  id: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface Type {
  name: string;
}

export default function Home() {

    const baseUrl = "https://pokeapi.co/api/v2/";

    const [totalPokemons, setTotalPokemons] = useState<number>(1302);
    const [limit, setLimit] = useState<number>(20);
    const [auxiliarLimit, setAuxiliarLimit] = useState<number>(20);
    const [offset, setOffset] = useState<number>(0);
    const [numberOfPages, setNumberOfPages] = useState<number>(52);
    const [types, setTypes] = useState<Type[]>([]);
    const [pokemonType, setPokemonType] = useState<number>(0);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    //const [inputValue, setInputValue] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { darkMode, toggleDarkMode } = useDarkMode();

    const { loadPokemonData, getPokemonByType, searchAPokemon, setInputValue } = useGetPokemon({ baseUrl, limit, offset,
        setOffset, setPokemonList, setTotalPokemons, setLoading, setError, setTypes
    });

    const { buttonNext, buttonPrevious, auxiliarCurrentPage } = usePagination({ baseUrl,
        limit, offset, setOffset, totalPokemons, pokemonType, loadPokemonData,
        getPokemonByType, setCurrentPage
    });

    const { typeFilter } = useFilter({ baseUrl, auxiliarLimit, offset, setOffset, setLimit,
        setTotalPokemons, setCurrentPage, loadPokemonData, getPokemonByType, pokemonType
    });

    const changePokemonQuantity = (event: React.ChangeEvent<HTMLSelectElement>) => {

      setAuxiliarLimit(+event.target.value);
    };

    const changeInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

      setInputValue(event.target.value);
    };

    const changePokemonType = (event: React.ChangeEvent<HTMLSelectElement>) => {

      setPokemonType(+event.target.value);
    };

    const calculateNumberOfPages = (paginationNumber: number, totalPokemons: number): number => {

      return Math.ceil(totalPokemons / paginationNumber);
    };

    useEffect(() => {

      setNumberOfPages(calculateNumberOfPages(limit, totalPokemons));
    }, [limit, totalPokemons, pokemonType]);

    useEffect(() => {

      setCurrentPage(auxiliarCurrentPage);
    }, [auxiliarCurrentPage]);

  return (
    <section id="center-pokedex" className="center-pokedex">
        
      <ControlBoard darkMode={darkMode} toggleDarkMode={toggleDarkMode} paginationValue={auxiliarLimit}
      changePokemonQuantity={changePokemonQuantity} numberOfPages={numberOfPages} types={types}
      changePokemonType={changePokemonType} pokemonType={pokemonType} typeFilter={typeFilter}
      changeInput={changeInputSearch} searchInput={searchAPokemon} buttonPrevious={buttonPrevious} 
      buttonNext={buttonNext} currentPage={currentPage}/>

      <DataScreen darkMode={darkMode} loading={loading} error={error} pokemonList={pokemonList} />

    </section>
  );
}
