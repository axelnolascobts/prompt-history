"use client"

import { useState, useEffect } from "react";
import "./details.css";
import { TopBar } from "./components/TopBar";
import { SpritesSection } from "./components/SpritesSection";
import { PokemonInfo } from "./components/PokemonInfo";

interface PokemonTypes {
    
    type: {
        name: string;
        url: string;
    };
}

interface PokemonSprite {
    front_default?: string;
    front_shiny?: string;
    back_default?: string;
    back_shiny?: string;
    other?: {
        dream_world?: {
            front_default?: string;
        };
    };
}

export interface PokemonDetails {
    id: number;
    name: string;
    sprites: PokemonSprite; 
    types: PokemonTypes[];
    height: number;
    weight: number;
}

export default function Details() {
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const searchValue = urlParams.get("searchValue");

        if (!searchValue) return;

        const fetchPokemonDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
                if (!response.ok) {
                    throw new Error("POKEMON NOT FOUND");
                }

                const data = await response.json();
                setPokemonDetails(data); 

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

        fetchPokemonDetails();
    }, []);

    if (loading) {
        return <p className="loading-message">Loading...</p>;
    }

    if (error) {
        return <p className="loading-message">{error}</p>;
    }

    if (!pokemonDetails) {
        return <p className="loading-message">POKEMON NOT FOUND</p>;
    }

    return (
        <section id="details-container" className="details-container">
           
           <TopBar pokemonDetails={pokemonDetails}/>

            <section id="more-info" className="more-info">

                <SpritesSection pokemonDetails={pokemonDetails}/>

                <PokemonInfo pokemonDetails={pokemonDetails}/>

            </section>
        </section>
    );
}
