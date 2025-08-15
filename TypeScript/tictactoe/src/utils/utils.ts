
interface Winner {

  player: "X" | "O";
  line: number[];
}

export function calculateWinner(board: (string | null)[]): Winner | null {

  const matriz: (string | null)[][] = [];

  for (let i = 0; i < 9; i += 3) {

    matriz.push(board.slice(i, i + 3));
  }

  for (let row = 0; row < 3; row++) {

    if ( matriz[row][0] !== null && matriz[row][0] === matriz[row][1] &&
    matriz[row][1] === matriz[row][2] ) {

      const line = [row * 3, row * 3 + 1, row * 3 + 2];

      return { player: matriz[row][0] as "X" | "O", line };
    }
  }

  for (let column = 0; column < 3; column++) {

    if ( matriz[0][column] !== null && matriz[0][column] === matriz[1][column] &&
    matriz[1][column] === matriz[2][column] ) {

      const line = [column, column + 3, column + 6];

      return { player: matriz[0][column] as "X" | "O", line };
    }
  }

  if ( matriz[0][0] !== null && matriz[0][0] === matriz[1][1] && matriz[1][1] === matriz[2][2] ) {

    return { player: matriz[0][0] as "X" | "O", line: [0, 4, 8] };

  } else if ( matriz[2][0] !== null && matriz[2][0] === matriz[1][1] && matriz[1][1] === matriz[0][2] ) {

    return { player: matriz[2][0] as "X" | "O", line: [6, 4, 2] };
  } else {

    return null;
  }
}

export function isDraw(board: (string | null)[]): boolean {
    
  return board.every(cell => cell !== null);
}
