import { useState } from 'react';
import Header from './Header';
import Scoreboard from './Scoreboard';
import Board from './Board';
import './App.css';


const initialBoard = Array(9).fill(null);

function App() {
const [board, setBoard] = useState(initialBoard);
const [turn, setTurn] = useState<'X' | 'O'>('X');  //turn puede ser X, O o null 
const [score, setScore] = useState({ X: 0, O: 0, TIE: 0 });
const [winner, setWinner] = useState<'X' | 'O' | 'TIE' | null>(null); //hacemos lo mismo con winner



  const handleCellClick = (idx: number) => {
    if (board[idx] || winner) return;
     // Si la celda ya tiene valor o ya hay ganador, no hace nada
    const newBoard = [...board];
    newBoard[idx] = turn;   // Actualiza la celda clickeada con el símbolo del jugador actual
    setBoard(newBoard);   // Actualiza el estado para que React vuelva a renderizar
    const win = checkWinner(newBoard); // Estado actual del tablero
    if (win) {
    setWinner(turn);

  
  if (turn === 'X') {
    setScore({ X: score.X + 1, O: score.O, TIE: score.TIE }); // Incrementa el marcador del jugador X
  } else {
    setScore({ X: score.X, O: score.O + 1, TIE: score.TIE }); // Incrementa el marcador del jugador O
  }
  

} else if (newBoard.every(cell => cell)) { // Verifica si el tablero está lleno y no hay ganador
  setWinner('TIE'); // Establece un empate
} else {
  setTurn(turn === 'X' ? 'O' : 'X'); // Cambia el turno al otro jugador
}
  };


  // Reinicia todo al predeterminado
  const handleReset = () => {
    setBoard(initialBoard);
    setWinner(null);
    setTurn('X');
  };


function checkWinner(board: ('X' | 'O' | null)[]): 'X' | 'O' | null {
  // Definimos todas las combinaciones ganadoras posibles
  const winningLines = [
    [0,1,2], [3,4,5], [6,7,8],  // filas
    [0,3,6], [1,4,7], [2,5,8],  // columnas
    [0,4,8], [2,4,6]            // diagonales
  ];



  // Recorremos todas las líneas ganadoras posibles
  for (const line of winningLines) {
    const [pos1, pos2, pos3] = line;
  

    // Revisamos si las tres posiciones están ocupadas por el mismo símbolo (X o O)
    if (
      board[pos1] !== null && 
      board[pos1] === board[pos2] && 
      board[pos1] === board[pos3]
    )
     {
      return board[pos1];  // Retornamos el símbolo ganador ('X' o 'O')
    }
  }
  

  // Si no hay ganador, retornamos null
  return null;
}


  return (         
    <div className="app"> 
      <Header turn={turn} winner={winner} onReset={handleReset} />
      <Scoreboard score={score} />
      <Board board={board} onCellClick={handleCellClick} winner={winner} />
    </div>
  );
}

export default App;
