"use client"

import React, { useState, useEffect } from "react";
import { ControlBoard } from "./components/ControlBoard";
import { DataScreen } from "./components/DataScreen";

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
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [limit, setLimit] = useState<number>(20);
    const [auxiliarLimit, setAuxiliarLimit] = useState<number>(20);
    const [offset, setOffset] = useState<number>(0);
    const [numberOfPages, setNumberOfPages] = useState<number>(52);
    const [types, setTypes] = useState<Type[]>([]);
    const [pokemonType, setPokemonType] = useState<number>(0);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    

    const toggleDarkMode = () => {

        if(darkMode){

            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');       
        }else{

            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
        }

        setDarkMode(!darkMode);
    };

    const changePokemonQuantity = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setAuxiliarLimit(+event.target.value);

        //setNumberOfPages(calculateNumberOfPages(+event.target.value, totalPokemons));
    };

    const calculateNumberOfPages = (paginationNumber: number, totalPokemons: number) => {

        return Math.ceil(totalPokemons / paginationNumber);
    };

    const loadPokemonData = async (url: string) => {
        setLoading(true);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('POKEMON NOT FOUND');
            }

            const data = await response.json();
            const pokemonData = data.results;

            if(Array.isArray(pokemonData)){

                const pokemonDetailsPromises = pokemonData.map(async (pokemon) => {
                    const response = await fetch(pokemon.url);
                    return await response.json();
                });

                const pokemonDetails = await Promise.all(pokemonDetailsPromises);
                setPokemonList(pokemonDetails);

            } else {

                setPokemonList([data]);
            }
        } catch (error: unknown) {

            if (error instanceof Error) {

                setError(error.message);
            } else {

                setError("An unknown error occurred");
            }
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        //loadPokemonData(`${baseUrl}pokemon?limit=${limit}&offset=${offset}`);

        const consultTypes = async () => {

            try {

                const url = `${baseUrl}type`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("POKEMON TYPES NOT FOUND");
                }

                const data = await response.json();
                setTypes(data.results);

            } catch (error) {

                console.error("Error fetching types:", error);
            }
        };

        consultTypes();
        updatePagination();
    }, [limit]);

    useEffect(() => {

        setNumberOfPages(calculateNumberOfPages(limit, totalPokemons));
        //updatePagination();

    }, [limit, totalPokemons]);

    const changePokemonType = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setPokemonType(+event.target.value);
    }

    const getPokemonByType = async (url: string) => {

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Pokémon not found');
            }

            const data = await response.json();
            const firstPokemons = data.pokemon.slice(offset, offset + limit);
            //console.log(firstPokemons.pokemon);

            const pokemonData = [];

            for(const pokemon of firstPokemons){

                pokemonData.push(pokemon.pokemon);
            }

            const pokemonDetailsPromises = pokemonData.map(async (pokemon) => {
                const response = await fetch(pokemon.url);
                return await response.json();
            });

            const pokemonDetails = await Promise.all(pokemonDetailsPromises);
            setPokemonList(pokemonDetails);
            
            setTotalPokemons(data.pokemon.length);
            setNumberOfPages(calculateNumberOfPages(limit, totalPokemons));
            
        } catch (error: unknown) {

            if (error instanceof Error) {

                setError(error.message);
            } else {

                setError("An unknown error occurred");
            }
        } finally {

            setLoading(false);
        }
    };

    const typeFilter = () => {

        setLimit(auxiliarLimit);
        setCurrentPage(1);
        setOffset(0);
        
        if (pokemonType < 1) {
            //console.log(pokemonType);
            setTotalPokemons(1302);
            
            const url = `${baseUrl}pokemon/?limit=${limit}&offset=${offset}`;
            loadPokemonData(url);
        } else {

            const url = `${baseUrl}type/${pokemonType}/`;
            getPokemonByType(url);
        }
    };

    const changeInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

        setInputValue(event.target.value);
    }

    const searchAPokemon = () => {
        let url = "";
        setOffset(0);
        setError(null);

        if (inputValue === "") {
            
            console.log("hola");
        
            setTotalPokemons(1302);
            url = `${baseUrl}pokemon/?limit=${limit}&offset=${offset}`;
            loadPokemonData(url);
            updatePagination();

        } else {
            setTotalPokemons(limit);
            url = `${baseUrl}pokemon/${inputValue}/`;
            loadPokemonData(url);
        }

        loadPokemonData(url);
    };

    const paginationWithoutFilter = async () => {
        const url = `${baseUrl}pokemon?limit=${limit}&offset=${offset}`;
        loadPokemonData(url);
    };

    const paginationWithTypeFilter = async () => {
        const url = `${baseUrl}type/${pokemonType}/`;
        getPokemonByType(url);
    };

    const buttonNext = () => {
        if (offset + limit < totalPokemons) {
            setOffset(offset + limit);
        }
    };

    const buttonPrevious = () => {
        if (offset > 0) {
            setOffset(Math.max(offset - limit, 0));
        }
    };

    useEffect(() => {

        setCurrentPage(Math.floor(offset / limit) + 1);
        updatePagination();
        
    }, [offset]);

    useEffect(() => {

        updatePagination();

    }, [limit])

    function updatePagination() {

        if (pokemonType < 1) {
            paginationWithoutFilter();
        } else {
            paginationWithTypeFilter();
        }

    };


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
