import { useState } from "react";
import Header from "./Header";
import Board from "./Board";
import { calculateWinner, isDraw } from "./utils/utils";

export interface Winner {

  player: "X" | "O";
  line: number[];
}

export function App() {

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<string>("X");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [victoriesX, setVictoriesX] = useState<number>(0);
  const [victoriesO, setVictoriesO] = useState<number>(0);
  const [lastWinner, setLastWinner] = useState<"X" | "O">("X");
  
  function playGame(index: number): void {

    if (board[index] || winner) return;

    const newBoard: (string | null)[] = board.slice();
    newBoard[index] = turn;
    setBoard(newBoard);

    const win: Winner | null = calculateWinner(newBoard);

    if (win) {

      setWinner(win);
      setLastWinner(win.player);

      if (win.player === "X") setVictoriesX(victories => victories + 1);

      else setVictoriesO(victories => victories + 1);

      setTurn(`Player ${win.player} Wins !!!`);

    } else if (isDraw(newBoard)) {

      setTurn("DRAW !!!");

    } else {

      setTurn(turn === "X" ? "O" : "X");
    }
  }

  function restartGame(): void {

    setBoard(Array(9).fill(null));
    setTurn(lastWinner);
    setWinner(null);
  }

  return (
    <>
      <Header turn={turn} victoriesX={victoriesX} victoriesO={victoriesO} onRestart={restartGame} />
      <Board board={board} onPlay={playGame} winner={winner} />
    </>
  );
}
