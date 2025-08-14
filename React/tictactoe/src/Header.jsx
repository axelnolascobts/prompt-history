import React from "react";

export default function Header({ turn, victoriesX, victoriesO, onRestart }) {
  return (
    <header id="header">
      <article id="title">
        <h1>TIC-TAC-TOE</h1>
      </article>
      
      <article id="counters">
        <div className="counter">
          <p>Victorias de X:</p>
          <p>{victoriesX}</p>
        </div>
        <div className="counter">
          <p>Victorias de O:</p>
          <p>{victoriesO}</p>
        </div>
      </article>

      <article id="turns">
        <p>
          {turn === "X" ? "Turno de X" : turn === "O" ? "Turno de O" : turn}
        </p>
      </article>
      
      <article id="button">
        <button id="restart-button" onClick={onRestart}>
          REINICIAR
        </button>
      </article>
    </header>
  );
}
