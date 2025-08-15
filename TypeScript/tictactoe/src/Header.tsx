
interface HeaderProperties {

  turn: string;
  victoriesX: number;
  victoriesO: number;
  onRestart: () => void;
}

const Header: React.FC<HeaderProperties> = ({ turn, victoriesX, victoriesO, onRestart }) => {
  return (
    <header id="header">
      
      <article id="counters">
        <div className="counter">
          <p>Victories of X:</p>
          <p>{victoriesX}</p>
        </div>

        <article id="title">
          <h1>TIC-TAC-TOE</h1>
        </article>
        
        <div className="counter">
          <p>Victories of O:</p>
          <p>{victoriesO}</p>
        </div>
      </article>

      <article id="turns">
        <p>
          {turn === "X" ? "Turn of X" : turn === "O" ? "Turn of O" : turn}
        </p>
      </article>
      
      <article id="button">
        <button id="restart-button" onClick={onRestart}>
          RESTART
        </button>
      </article>
    </header>
  );
}

export default Header;
