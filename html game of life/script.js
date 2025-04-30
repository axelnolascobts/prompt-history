let gridArray = [];
let intervalId = null;

function Grid_vacio(size) {
  gridArray = [];
  const gridSection = document.querySelector(".grid_section");
  gridSection.innerHTML = '';
  gridSection.style.cssText = `display: grid; grid-template-columns: repeat(${size}, 20px);`;

  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push("X");
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.classList.add(`row-${i}`, `col-${j}`);

      cell.addEventListener('click', () => {
        if (gridArray[i][j] === "X") {
          gridArray[i][j] = "O";
          cell.classList.add("alive");
        } else {
          gridArray[i][j] = "X";
          cell.classList.remove("alive");
        }
      });

      gridSection.appendChild(cell);
    }
    gridArray.push(row);
  }
}

function neighborsO(grid, x, y) {
  let count = 0;
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1],
    [0, 1], [1, -1], [1, 0], [1, 1]
  ];
  for (let [dx, dy] of dirs) {
    let nx = x + dx;
    let ny = y + dy;
    if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid.length) {
      if (grid[nx][ny] === "O") count++;
    }
  }
  return count;
}

function cellestado() {
  const celdas = document.querySelectorAll('.cell');
  let fila = 0, col = 0;

  for (let i = 0; i < celdas.length; i++) {
    if (gridArray[fila][col] === "O") {
      celdas[i].classList.add("alive");
    } else {
      celdas[i].classList.remove("alive");
    }
    col++;
    if (col >= gridArray[0].length) {
      col = 0;
      fila++;
    }
  }
}

function updateGrid() {
  let nueva = [];
  let vivos = 0;

  for (let i = 0; i < gridArray.length; i++) {
    nueva[i] = [];
    for (let j = 0; j < gridArray[i].length; j++) {
      let estado = gridArray[i][j];
      let vecinos = neighborsO(gridArray, i, j);

      if (estado === "O" && vecinos < 2) nueva[i][j] = "X";
      else if (estado === "O" && vecinos > 3) nueva[i][j] = "X";
      else if (estado === "X" && vecinos === 3) nueva[i][j] = "O";
      else nueva[i][j] = estado;

      if (nueva[i][j] === "O") vivos++;
    }
  }

  gridArray = nueva;
  cellestado();
}

const speedinput = document.getElementById("speed");
const startbutton = document.getElementById("start");
const sizeinput = document.getElementById("size");
const stopbutton = document.getElementById("stop");

stopbutton.onclick = () => {
  clearInterval(intervalId);
  gridArray = gridArray.map(row => row.map(() => "X"));
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove("alive");
  });
};

startbutton.onclick = () => {
  clearInterval(intervalId);
  const velocidad = parseInt(speedinput.value);
  intervalId = setInterval(updateGrid, velocidad);
};

sizeinput.onchange = () => {
  const tamaño = parseInt(sizeinput.value);
  if (tamaño >= 20 && tamaño <= 150) {
    Grid_vacio(tamaño);
  }
};
