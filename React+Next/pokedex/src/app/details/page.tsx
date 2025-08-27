"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./details.css";

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

interface PokemonDetails {
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
            <section id="top-bar" className="top-bar">
                <article id="back-button" className="back-button">
                    <Link href="/">BACK</Link>
                </article>
                <article id="pokemon-title" className="pokemon-title">
                    <p id="pokemon-big-name" className="pokemon-big-name">{pokemonDetails.name.toUpperCase()}</p>
                    <p id="pokemon-id" className="pokemon-id">POKEDEX NUMBER: {pokemonDetails.id}</p>
                </article>
            </section>

            <section id="more-info" className="more-info">
                <section id="sprites-grid" className="sprites-grid">
                    {Object.values(pokemonDetails.sprites)
                        .filter((sprite) => typeof sprite === "string")
                        .map((sprite, index) => (
                            <Image key={index} className="pokemon-sprite"
                            src={sprite}
                            alt={pokemonDetails.name}
                            width={400}
                            height={400}/>
                        ))}
                </section>

                <section id="more-details" className="more-details">
                    <p id="pokemon-types">
                        TYPE(S): {pokemonDetails.types.map((type) => type.type.name).join(", ")}
                    </p>
                    <p id="pokemon-height">HEIGHT: {pokemonDetails.height / 10} m</p>
                    <p id="pokemon-weight">WEIGHT: {pokemonDetails.weight / 10} kg</p>
                </section>
            </section>
        </section>
    );
}
