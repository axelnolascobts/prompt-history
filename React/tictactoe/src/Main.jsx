import React, { useState } from "react";
import Header from "./Header";
import Board from "./Board";
import { calculateWinner, isDraw } from "./utils/utils";

export default function App() {

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [victoriesX, setVictoriesX] = useState(0);
  const [victoriesO, setVictoriesO] = useState(0);
  const [lastWinner, setLastWinner] = useState("X");
  
  function playGame(index) {

    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = turn;
    setBoard(newBoard);

    const win = calculateWinner(newBoard);

    if (win) {

      setWinner(win);
      setLastWinner(win.player);

      if (win.player === "X") setVictoriesX(victories => victories + 1);

      else setVictoriesO(victories => victories + 1);

      setTurn(`GANA ${win.player} !!!`);

    } else if (isDraw(newBoard)) {

      setTurn("EMPATE !!!");

    } else {

      setTurn(turn === "X" ? "O" : "X");
    }
  }

  function restartGame() {

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
