import { useEffect, useState } from 'react';
import { Pokemon, Type } from '../page';

interface UsePokemonDataProps {
    
  baseUrl: string;
  limit: number;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setPokemonList: React.Dispatch<React.SetStateAction<Pokemon[]>>;
  setTotalPokemons: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setTypes: React.Dispatch<React.SetStateAction<Type[]>>;
}

export const useGetPokemon = ({ baseUrl, limit, offset, setOffset, setPokemonList, setTotalPokemons,
  setLoading, setError, setTypes }: UsePokemonDataProps) => {

    const [inputValue, setInputValue] = useState<string>('');

    const loadPokemonData = async (url: string) => {
        setLoading(true);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('POKEMON NOT FOUND');
            }

            const data = await response.json();
            const pokemonData = data.results;

            if (Array.isArray(pokemonData)) {

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

    const getPokemonByType = async (url: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('POKEMON NOT FOUND');
            }

            const data = await response.json();
            const firstPokemons = data.pokemon.slice(offset, offset + limit);

            const pokemonData = [];

            for (const pokemon of firstPokemons) {
                pokemonData.push(pokemon.pokemon);
            }

            const pokemonDetailsPromises = pokemonData.map(async (pokemon) => {
                const response = await fetch(pokemon.url);
                return await response.json();
            });

            const pokemonDetails = await Promise.all(pokemonDetailsPromises);
            setPokemonList(pokemonDetails);
            setTotalPokemons(data.pokemon.length);

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

    const searchAPokemon = () => {

        let url = '';
        setOffset(0);
        setError(null);

        if (inputValue.trim() === '') {
            setTotalPokemons(1302);
            url = `${baseUrl}pokemon/?limit=${limit}&offset=${offset}`;
            loadPokemonData(url);
        } else {

            setTotalPokemons(limit);
            url = `${baseUrl}pokemon/${inputValue}/`;
            loadPokemonData(url);
        }
    };

    useEffect(() => {
        consultTypes();
    }, []);

    return { loadPokemonData, getPokemonByType, consultTypes, searchAPokemon, setInputValue };
};
