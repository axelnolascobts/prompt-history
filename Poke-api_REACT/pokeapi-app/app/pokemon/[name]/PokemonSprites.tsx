import React from "react";
import Image from "next/image";

interface SpriteInfo {
  name: string;
  url: string;
}

interface Props {
  spriteList: SpriteInfo[];
}

export default function PokemonSprites({ spriteList }: Props) {
  return (
    <div className="bordes_2">
      <h2>Sprites:</h2>
      <div className="details-sprites">
        {spriteList.map((sprite) => (
          <div key={sprite.name} className="sprite-item">
            <p>{sprite.name}</p>
            <Image src={sprite.url} alt={sprite.name} width={65} height={65} />
          </div>
        ))}
      </div>
    </div>
  );
}
