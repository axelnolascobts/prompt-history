export default function PokemonCard({ poke }: { poke: any }) {
  const types = poke.types.map((t: any) => t.type.name).join(", ");
  return (
    <div className="border rounded p-4 text-center">
      <img
        src={poke.sprites.front_default}
        alt={poke.name}
        className="mx-auto mb-2"
      />
      <p className="font-bold">{poke.name}</p>
      <p>Types: {types}</p>
    </div>
  );
}
