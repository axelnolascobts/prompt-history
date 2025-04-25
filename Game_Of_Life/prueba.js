"use strict";

// Función para poblar la matriz con células vivas aleatorias
function liveCells(matriz) {
    for (let fila of matriz) {
        let n = Math.floor(Math.random() * 20);
        for (let x = 0; x < n; x++) {
            let liveCell = Math.floor(Math.random() * 20);
            fila[liveCell] = "O";
        }
    }
}

// Función para mostrar la matriz en consola
function showGrid(matriz) {
    for (let i = 0; i < 20; i++) {
        let fila = '|';
        for (let j = 0; j < 20; j++) {
            fila += ' ' + matriz[i][j] + ' |';
        }
        console.log(fila);
    }
}

// Función que evalúa los vecinos y aplica las reglas del juego
function gameOfLife(matriz) {
    let newMatriz = Array.from({ length: 20 }, () => Array(20).fill("X"));

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
            let aliveNeighbors = 0;
            const actual = matriz[row][col];

            // Verifica los vecinos dependiendo de la posición
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    let ni = row + i;
                    let nj = col + j;
                    if (ni >= 0 && ni < 20 && nj >= 0 && nj < 20) {
                        aliveNeighbors += hiNeighbors(matriz[ni][nj]);
                    }
                }
            }

            // Aplica las reglas de Conway
            if (actual === "X" && aliveNeighbors === 3) {
                newMatriz[row][col] = "O";
            } else if (actual === "O" && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
                newMatriz[row][col] = "X";
            } else {
                newMatriz[row][col] = matriz[row][col];
            }
        }
    }

    console.clear();
    showGrid(newMatriz);
    return newMatriz;
}

// Función auxiliar para contar vecinos vivos
function hiNeighbors(value) {
    return value === "O" ? 1 : 0;
}

// Variables de control
let intervalo = null;
let run = false;
let matriz = Array.from({ length: 20 }, () => Array(20).fill("X"));

// Modo de entrada por teclado
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', function(tecla) {
    const key = tecla.toString().toLowerCase();

    if (key === "s") {
        if (!run) {
            intervalo = setInterval(() => {
                matriz = gameOfLife(matriz);
            }, 500);
            run = true;
        } else {
            clearInterval(intervalo);
            run = false;
        }
    } else if (key === "r") {
        clearInterval(intervalo);
        matriz = Array.from({ length: 20 }, () => Array(20).fill("X"));
        liveCells(matriz);
        showGrid(matriz);
        run = false;
    } else if (key === "\u0003") { // Ctrl+C para salir
        process.exit();
    }
});

// Inicializa el juego
liveCells(matriz);
showGrid(matriz);
