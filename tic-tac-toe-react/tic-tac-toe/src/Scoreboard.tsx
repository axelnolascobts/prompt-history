function Scoreboard({ score }: { score: { X: number; O: number; TIE: number } }) {

  return (
    // retorna un parrafo con la clase marcador y el marcador de cada jugador
    <p className="score">
      Player 1 (X): <span>{score.X}</span> Victories |{' '} 
      Player 2 (O): <span>{score.O}</span> Victories
    </p>
  );
  //Usar { ' ' } asegura que se renderice un espacio real y explícito.
  //  representa un espacio en blanco explícito dentro del JSX. evitando que react no renderice el espacio
  //  entre los dos puntos y el marcador del jugador 2.
  //  Esto es útil para mantener un formato limpio y legible en el marcador.
}

export default Scoreboard;