function createGrid(nRows) {
  if (isNaN(nRows)) {
    return 'error';
  }

  let aux = nRows + 2;
  let mat = [];

  //let matriz = Array.from({ length: aux }, () => Array(aux).fill(random(aux)));
  for (let i = 0; i < aux; i++) {
    //l//et x = Math.floor(Math.random() * nRows-2);
    mat[i] = [];

    for (let j = 0; j < aux; j++) {
      if (i === 0 || i === aux - 1 || j === 0 || j === aux - 1) {
        mat[i][j] = 'X';
      } else {
        //l//et ix = Math.floor(Math.random() * nRows-2);

        mat[i][j] = random(aux);
      }
    }
  }

  //console.log(matriz);
  return mat; //liveCells(aux, matriz);
};

function random(nRows) {
  let x = Math.floor(Math.random() * nRows - 2) % 2;

  return x === 0 ? 'O' : 'X';
};

function liveCells(nRows, matriz) {
  for (let i = 1; i < nRows - 1; i++) {
    let x = Math.floor(Math.random() * nRows - 2);

    for (let j = 1; j < x; j++) {
      let ix = Math.floor(Math.random() * nRows - 2);

      matriz[i][ix] = 'O';
    };
  };

  //console.log(matriz);
  return matriz;
  //showGrid(nRows, matriz);
};

function showGrid(num, matriz) {
  for (let i = 1; i < num - 1; i++) {
    let fila = '';

    for (let j = 1; j < num - 1; j++) {
      fila += matriz[i][j] + ' ';
    }
    console.log(fila);
  }
  console.log(' ');
  //return matriz;
  //console.clear();
  //setInterval(gameOfLife(matriz), 500);
};

function gameOfLife(matriz) {
  const lMat = matriz.length;

  let nMatriz = Array.from({ length: lMat }, () => Array(lMat).fill('X'));

  for (let row = 1; row < matriz.length - 2; row++) {
    for (let col = 1; col < matriz.length - 2; col++) {
      let vecinos = 0;
      const actual = matriz[row][col];

      vecinos = findVecinos(matriz, row, col);

      /*if(row===0 && col===0){

                vecinos+=contVecinos(matriz[row][col+1]);
                vecinos+=contVecinos(matriz[row+1][col]);
                vecinos+=contVecinos(matriz[row+1][col+1]);
            }else if(row===0 && col===matriz.length-1){

                vecinos+=contVecinos(matriz[row][col-1]);
                vecinos+=contVecinos(matriz[row+1][col-1]);
                vecinos+=contVecinos(matriz[row+1][col]);
            }else if(row===matriz.length-1 && col===0){

                vecinos+=contVecinos(matriz[row-1][col]);
                vecinos+=contVecinos(matriz[row-1][col+1]);
                vecinos+=contVecinos(matriz[row][col+1]);
            }else if(row===matriz.length-1 && col===matriz.length-1){

                vecinos+=contVecinos(matriz[row-1][col-1]);
                vecinos+=contVecinos(matriz[row-1][col]);
                vecinos+=contVecinos(matriz[row][col-1]);
            }else if(row===0){

                vecinos+=contVecinos(matriz[row][col-1]);
                vecinos+=contVecinos(matriz[row][col+1]);
                vecinos+=contVecinos(matriz[row+1][col-1]);
                vecinos+=contVecinos(matriz[row+1][col]);
                vecinos+=contVecinos(matriz[row+1][col+1]);
            }else if(row===matriz.length-1){

                vecinos+=contVecinos(matriz[row][col-1]);
                vecinos+=contVecinos(matriz[row][col+1]);
                vecinos+=contVecinos(matriz[row-1][col-1]);
                vecinos+=contVecinos(matriz[row-1][col]);
                vecinos+=contVecinos(matriz[row-1][col+1]);
            }else if(col===0){

                vecinos+=contVecinos(matriz[row-1][col]);
                vecinos+=contVecinos(matriz[row-1][col+1]);
                vecinos+=contVecinos(matriz[row][col+1]);
                vecinos+=contVecinos(matriz[row+1][col]);
                vecinos+=contVecinos(matriz[row+1][col+1]);
            }else if(col===matriz.length-1){

                vecinos+=contVecinos(matriz[row-1][col]);
                vecinos+=contVecinos(matriz[row-1][col-1]);
                vecinos+=contVecinos(matriz[row][col-1]);
                vecinos+=contVecinos(matriz[row+1][col]);
                vecinos+=contVecinos(matriz[row+1][col-1]);
            }else{

                vecinos+=contVecinos(matriz[row-1][col-1]);
                vecinos+=contVecinos(matriz[row-1][col]);
                vecinos+=contVecinos(matriz[row-1][col+1]);
                vecinos+=contVecinos(matriz[row][col+1]);
                vecinos+=contVecinos(matriz[row][col-1]);
                vecinos+=contVecinos(matriz[row+1][col-1]);
                vecinos+=contVecinos(matriz[row+1][col]);
                vecinos+=contVecinos(matriz[row+1][col+1]);
            };*/

      //console.log(vecinos);

      if (actual === 'X' && vecinos === 3) {
        nMatriz[row][col] = 'O';
      } else if (actual === 'O' && vecinos >= 4) {
        nMatriz[row][col] = 'X';
      } else if (actual === 'O' && vecinos < 2) {
        nMatriz[row][col] = 'X';
      } else {
        nMatriz[row][col] = actual;
      }
    }
  }

  if (compareMatriz(matriz, nMatriz) === false) {
    clearInterval(intervalo);
  }

  return nMatriz;
}

function findVecinos(matriz, row, col) {
  let conteo = 0;
  for (i = row - 1; i <= row + 1; i++) {
    for (j = col - 1; j <= col + 1; j++) {
      if (j !== i) {
        conteo += contVecinos(matriz[i][j]);
      }
    }
  }
  return conteo;
}

function contVecinos(vec) {
  if (vec === 'O') {
    return 1;
  } else if (vec === 'X') {
    return 0;
  }
}

function compareMatriz(m1, m2) {
  for (let i = 0; i < m1.length - 1; i++) {
    for (let j = 0; j < m1.length - 1; j++) {
      if (m1[i][j] !== m2[i][j]) {
        return true;
      }
    }
  }

  return false;
}

//setInterval(gameOfLife, 500);

function hola() {
  console.log('hola');
}

//setInterval(hola, 1000);

//createGrid(100);
let m = createGrid(20);
//console.log(m.length);

showGrid(m.length, m);
//gameOfLife(m);

function main() {
  console.clear();

  m = gameOfLife(m);
  //console.log(m);
  showGrid(m.length, m);
}

const intervalo = setInterval(main, 100);

const configGame = (function(){
  let medida = 20;
  let speed = 500;

  return{
    setSize(newMedida){
      medida=newMedida;
    },
    setSpeed(newSpeed){
      speed=newSpeed;
    },
    getSpeed(){
      return speed;
    },
    getSize(){
      return medida;
    }
  };
})();
