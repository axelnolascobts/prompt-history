import PokemonCard from "./PokemonCard";

export default function PokemonGrid({ pokemons }: { pokemons: any[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {pokemons.map((poke) => (
        <PokemonCard key={poke.id} poke={poke} />
      ))}
    </div>
  );
}
