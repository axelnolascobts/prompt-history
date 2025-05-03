let cont = 0;
const cell = document.getElementsByClassName('celda');
let puntosJ1 = 0;
let puntosJ2 = 0;
const spanJ1 = document.getElementById("puntos-j1");
const spanJ2 = document.getElementById("puntos-j2");
function cellplayer() {
  for (let i = 0; i < cell.length; i++) {
    cell[i].onclick = () => {
      if (!cell[i].classList.contains("j1")) {
        if (cont % 2 === 0) {
          cell[i].classList.add("j1");
          cell[i].textContent = "X";
        }else {
            cell[i].classList.add("j2");
            cell[i].textContent = "O";
          }
          cont++;
          reglas();
          actualizarTurno();
      }
    };
  }
}


function reglas() {
  const combinaciones = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
  ];

  for (let combo of combinaciones) {
    const [a, b, c] = combo;

    // Jugador 1
    if (cell[a].classList.contains("j1") &&
        cell[b].classList.contains("j1") &&
        cell[c].classList.contains("j1")) {
      pintarGanador([a, b, c]);
      puntosJ1++;
      spanJ1.textContent = puntosJ1;
      alert("Jugador 1 gana");
      setTimeout(reiniciarJuego, 1000);
      return;
    }

    // Jugador 2
    if (cell[a].classList.contains("j2") &&
        cell[b].classList.contains("j2") &&
        cell[c].classList.contains("j2")) {
      pintarGanador([a, b, c]);
      puntosJ2++;
      spanJ2.textContent = puntosJ2;
      alert("Jugador 2 gana");
      setTimeout(reiniciarJuego, 1000);
      return;
    }
  }

  // Empate
  if (cont === 9) {
    alert("Empate");
    cont = 0;
    for (let i = 0; i < cell.length; i++) {
      cell[i].classList.remove("j1", "j2", "ganador");
      cell[i].textContent = "";
    }
    actualizarTurno();
  }
}

//reinicia el grid
const resetButton = document.querySelector('.reset');

resetButton.onclick = () => {
  cont = 0;
  for (let i = 0; i < cell.length; i++) {
    cell[i].classList.remove("j1", "j2", "ganador");
    cell[i].textContent = "";
  }
  actualizarTurno();
};
cellplayer();
//muestra los turnos de los jugadores
const turnoTexto = document.querySelector('.turno');

function actualizarTurno() {
  if (cont % 2 === 0) {
    turnoTexto.textContent = "Turno de: Jugador 1 (X)";
  } else {
    turnoTexto.textContent = "Turno de: Jugador 2 (O)";
  }
}
// combinacion ganadora de color verde al ganar
function pintarGanador(indices) {
  indices.forEach(i => {
    cell[i].classList.add("ganador");
  });
}
// Reiniciar el juego
function reiniciarJuego() {
  cont = 0;
  for (let i = 0; i < cell.length; i++) {
    cell[i].classList.remove("j1", "j2", "ganador");
    cell[i].textContent = "";
  }
  actualizarTurno();
}
