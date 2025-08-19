import Cell from './Cell';

// Tipado de las props del componente
interface BoardProps {
  board: ('X' | 'O' | null)[];       // El tablero, arreglo de 9 celdas
  onCellClick: (idx: number) => void; // Función que recibe el índice de la celda
  winner: 'X' | 'O' | 'TIE' | null;   // Ganador actual, empate o null
}

function Board({ board, onCellClick, winner }: BoardProps) { // Cambio: agregamos tipo BoardProps a las props
  // Logica de negocios siempre debe estar adentro del componente

  // Función para verificar si una celda está en la línea ganadora
  const isCellInWinningLine = (idx: number, winner: 'X' | 'O' | null): boolean => { 
    // Cambio: declaramos tipos de idx y winner, y retorno boolean para TypeScript
    // Antes no tenía tipos, por eso daba error de argumentos y retorno
    // Definimos todas las combinaciones ganadoras posibles
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    console.log(
      lines.some(line => 
        line.includes(idx) && 
        line.every(i => board[i] === winner))
    );

    // Verifica si alguna línea contiene la celda y todas las celdas tienen el mismo valor del ganador
    return lines.some(line => 
      line.includes(idx) && 
      line.every(i => board[i] === winner)
    );
  };

  return (
    <div className="container">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)} 
          // => Cuando necesitas pasar argumentos al evento en este caso,
          // se usa una función flecha para llamar a onCellClick con el índice de la celda.
          // Esto es necesario porque onClick espera una función, no el resultado de una función.
          // Si se usara onClick={onCellClick(idx)}, se ejecutaría inmediatamente
          // en lugar de esperar al clic.
          highlight={
            winner === 'X' || winner === 'O'   // Cambio: solo se llama a isCellInWinningLine si el ganador es X u O
              ? isCellInWinningLine(idx, winner)
              : false
          } 
        />
      ))}
    </div>
  );
}

export default Board;
