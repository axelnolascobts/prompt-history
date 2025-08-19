interface HeaderProps {
  turn: 'X' | 'O' | null;               // turno actual
  winner: 'X' | 'O' | 'TIE' | null;     // ganador actual o empate
  onReset: () => void;                   // función para reiniciar el juego
}


function Header({ turn, winner, onReset }: HeaderProps) {

  
  return (
    // retorna el header con el titulo, boton de reset y el turno o ganador
    <header className="header">

      <h1 className="title">Game of Tic Tac Toe</h1 >

      <button className="reset" onClick={onReset}>Reset Game</button>

      <p className="turn">
        {winner
          ? winner === 'TIE'
            ? 'TIE!'
            : `Winner: ${winner}`
          : `Turn of: ${turn === 'X' ? 'Player 1 (X)' : 'Player 2 (O)'}`}
      </p>

    </header>
  );
}

export default Header;