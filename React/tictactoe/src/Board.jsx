export default function Board({ onPlay, board, winner }) {
  return (
    <section id="cont-game">
      <article id="grid-cont">
        {board.map((cell, index) => (
          <div
            key={index}
            className="cell"
            style={{ color: winner && winner.line.includes(index) ? "rgb(40, 172, 0)" : "black" }}
            onClick={() => !cell && !winner && onPlay(index)}
          >
            {cell}
          </div>
        ))}
      </article>
    </section>
  );
}