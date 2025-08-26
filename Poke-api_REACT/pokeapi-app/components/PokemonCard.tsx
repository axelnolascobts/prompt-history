import Image from "next/image";

// Estructura esperada de un Pokémon
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string; // Imagen principal del Pokémon
  };
  types: {
    type: {
      name: string; // Nombre del tipo
    };
  }[];
}


// Props que recibe el componente: un Pokémon
interface PokemonCardProps {
  poke: Pokemon;
}

    // Componente que renderiza la tarjeta de un Pokémon
    export default function PokemonCard({ poke }: PokemonCardProps) {
      // Convertimos los tipos en un string separado por comas
      const types = poke.types.map((t) => t.type.name).join(", ");

      return (
        <div className="card border rounded p-4 text-center transition-colors duration-300">
          {/* Imagen del Pokémon */}
          <Image
            src={poke.sprites.front_default}
            alt={poke.name}
            width={96}
            height={96}
            priority // Carga inmediata para mejorar percepción de performance
          />

          {/* Nombre del Pokémon */}
          <p className="font-bold">{poke.name}</p>

          {/* Tipos del Pokémon */}
          <p>Types: {types}</p>
        </div>
      );
    }
