import Image from "next/image";

// Define the expected Pokemon structure
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
    <div className="border rounded p-4 text-center">
      <Image
        src={poke.sprites.front_default}
        alt={poke.name}
        width={96}
        height={96}
      />
      <p className="font-bold">{poke.name}</p>
      <p>Types: {types}</p>
    </div>
  );
}
