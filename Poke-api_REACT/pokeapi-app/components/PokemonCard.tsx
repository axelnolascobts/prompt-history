import Image from "next/image";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface PokemonCardProps {
  poke: Pokemon;
}

export default function PokemonCard({ poke }: PokemonCardProps) {
  const types = poke.types.map((t) => t.type.name).join(", ");

  return (
    <div className="card border rounded p-4 text-center transition-colors duration-300">
      {/* Imagen del Pokémon o placeholder */}
      {poke.sprites.front_default ? (
        <Image
          src={poke.sprites.front_default}
          alt={poke.name}
          width={96}
          height={96}
          // loading="lazy"
          priority= {true}
        />
      ) : (
        <div>
          No Image
        </div>
      )}

      {/* Nombre del Pokémon */}
      <p className="font-bold mt-2">{poke.name}</p>

      {/* Tipos del Pokémon */}
      <p>Types: {types}</p>
    </div>
  );
}
