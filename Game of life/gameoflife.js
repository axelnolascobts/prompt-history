function grid() {
  const arr = [];

  for (let i = 0; i < 22; i++) {
    const row = [];
    for (let j = 0; j < 22; j++) {
      if (i === 0 || i === 21 || j === 0 || j === 21) {
        row.push("-"); // Bordes con "-"
      } else {
        // Generar aleatoriamente 'X' o 'O'
        const randomValue = Math.random() < 0.5 ? "X" : "O";
        row.push(randomValue);
      }
    }
    arr.push(row);
  }

  return arr;
}

function countNeighbors(grid, x, y) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // Vecinos
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let countO = 0;

  directions.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;

    // Verificar que el vecino esté dentro de los límites y sea una 'O'
    if (
      nx >= 0 &&
      nx < grid.length &&
      ny >= 0 &&
      ny < grid[0].length &&
      grid[nx][ny] === "O"
    ) {
      countO++;
    }
  });

  return countO;
}

function updateGrid(grid) {
  const newGrid = grid.map((row) => [...row]);

  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      const neighborsO = countNeighbors(grid, i, j);
      const currentCell = grid[i][j];

      if (currentCell === "O") {
        // Underpopulation or Overpopulation
        if (neighborsO < 2 || neighborsO > 3) {
          newGrid[i][j] = "X";
        } else {
          // Survival
          newGrid[i][j] = "O";
        }
      } else if (currentCell === "X") {
        // Reproduction
        if (neighborsO === 3) {
          newGrid[i][j] = "O";
        } else {
          newGrid[i][j] = "X";
        }
      }
    }
  }

  return newGrid;
}

let intervalId; // Variable para almacenar el ID del intervalo
let isRunning = true; // Estado de ejecución

function isAllDead(grid) {
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      if (grid[i][j] === "O") {
        return false;
      }
    }
  }
  return true;
}

function startSimulation() {
  intervalId = setInterval(() => {
    currentGrid = updateGrid(currentGrid); // Actualiza el grid
    console.log("Grid actualizado:");
    currentGrid.forEach((row) => console.log(row.join(" ")));
    console.log("\n");

    if (isAllDead(currentGrid)) {
      stopSimulation();
      isRunning = false;
      console.log(" Simulación detenida: todas las células están muertas.");
    }
  }, 100); // Actualizar cada 500ms
}

function stopSimulation() {
  clearInterval(intervalId); // Detener el intervalo
}

// Generar el grid inicial
let currentGrid = grid();
console.log("Grid inicial:");
currentGrid.forEach((row) => console.log(row.join(" ")));
console.log("\n");

// Iniciar la simulación
startSimulation();

// Evento para pausar/continuar con la tecla s
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", (key) => {
  if (key.toString() === "s" || key.toString() === "S") {
    if (isRunning) {
      stopSimulation();
      isRunning = false;
      console.log("Simulación pausada.");
    } else {
      startSimulation();
      isRunning = true;
      console.log("Simulación reanudada.");
    }
  } else if (key.toString() === "r" || key.toString() === "R") {
    stopSimulation(); // Detener la simulación
    currentGrid = grid(); // Generar un nuevo grid aleatorio
    console.log("Sistema reiniciado:");
    currentGrid.forEach((row) => console.log(row.join(" ")));
    console.log("\n");
    if (isRunning) {
      startSimulation(); // Reiniciar la simulación si estaba corriendo
    }
  }
});
