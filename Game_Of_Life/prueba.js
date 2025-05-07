function createGrid(nRows, evMat) {
  if (isNaN(nRows)) {
    return 'error';
  }

  let aux = nRows + 2;
  //let mat = [];

  let matriz = Array.from({ length: aux }, () => Array(aux).fill("X"));
  for (let i = 1; i < aux-1; i++) {
    //l//et x = Math.floor(Math.random() * nRows-2);
    //mat[i] = [];

    for (let j = 1; j < aux-1; j++) {
      /*if (i === 0 || i === aux - 1 || j === 0 || j === aux - 1) {
        mat[i][j] = 'X';
      } else {
        //l//et ix = Math.floor(Math.random() * nRows-2);

        mat[i][j] = random(aux);*/
        if(evMat[i-1][j-1]==="rgb(139, 139, 139)"){
          matriz[i][j]="X";
        }else if(evMat[i-1][j-1]==="rgb(235, 192, 0)"){
          matriz[i][j]="O";
        };
      }
    }
  console.log(matriz);
  return matriz; //liveCells(aux, matriz);
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
    clearInterval(intervalo2);
  }

  return nMatriz;
}

function findVecinos(matriz, row, col) {
  let conteo = 0;
  for (i = row - 1; i <= row + 1; i++) {
    for (j = col - 1; j <= col + 1; j++) {
      if(i !==row || j !==col){
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
//let m = createGrid(20);
//console.log(m.length);

//showGrid(m.length, m);
//gameOfLife(m);

function main() {
  console.clear();

  m = gameOfLife(m);
  //console.log(m);
  showGrid(m.length, m);
}

//const intervalo = setInterval(main, 100);

const configGame = (function(){
  let medida = 20;
  let speed = 500;

  return{
    setSize(newMedida){
      if(newMedida>=5 && newMedida<=300){
        medida=newMedida;
      }else{
        medida=20;
      };
      
    },
    setSpeed(newSpeed){
      if(newSpeed>=25 && newSpeed <=10000){
        speed=newSpeed;
      }else{
        speed=500;
      };
    },
    getSpeed(){
      return speed;
    },
    getSize(){
      return medida;
    }
  };
})();

const inputFil = document.getElementById("numFil");
const inputVel = document.getElementById("numVel");

inputFil.value = configGame.getSize();
inputVel.value = configGame.getSpeed();

const updateButton = document.getElementById("updateButton");

updateButton.onclick = () => {
  main2();
  configGame.setSize(inputFil.value);
  configGame.setSpeed(inputVel.value);
  
  inputFil.value = configGame.getSize();
  inputVel.value = configGame.getSpeed();
  reiniciar();
  gridVisual();
};

const grid = document.getElementById("grid-cont");

function gridVisual(){
  
  grid.innerHTML = "";

  let tam = parseInt(configGame.getSize());

  grid.style.gridTemplateColumns = `repeat(${tam}, 30px)`;

  for(let c = 0; c < tam*tam; c++){

    const cell= document.createElement("div");
    cell.classList.add("cell")
    grid.appendChild(cell);
  
  };

  for(let i=0; i < celdas.length; i++){

    let col2=getComputedStyle(celdas[i]).backgroundColor;
    
    celdas[i].onclick = () => {
  
      let col=getComputedStyle(celdas[i]).backgroundColor;
      //console.log(col);
    
      if(col === "rgb(139, 139, 139)"){
        celdas[i].style.backgroundColor = "rgb(235, 192, 0)";
      }else{
        celdas[i].style.backgroundColor = "rgb(139, 139, 139)";
      };
    };
    colores.push(col2);
  };

};

/*let tam = configGame.getSize();
let vel = configGame.getSpeed();

grid.style.gridTemplateColumns = `repeat(${tam}, 30px)`;


for(let c = 0; c < tam*tam; c++){

  const cell= document.createElement("div");
  cell.classList.add("cell")
  grid.appendChild(cell);

};*/

const celdas = document.getElementsByClassName("cell");
console.log(celdas);

const colores= [];
/*
//Esto es para cambiar el color de celdas (YA FUNCIONA ALV)
for(let i=0; i < celdas.length; i++){

  let col2=getComputedStyle(celdas[i]).backgroundColor;
  
  celdas[i].onclick = () => {

    let col=getComputedStyle(celdas[i]).backgroundColor;
    //console.log(col);
  
    if(col === "rgb(139, 139, 139)"){
      celdas[i].style.backgroundColor = "rgb(235, 192, 0)";
    }else{
      celdas[i].style.backgroundColor = "rgb(139, 139, 139)";
    };
  };
  colores.push(col2);
};

console.log(colores);

let h = 0;
let matGrid = [];
while(h < colores.length){
  let aux = colores.slice(h, h+tam);
  matGrid.push(aux);

  h+=tam;
};

//console.log("matgrid: "+matGrid);

createGrid(tam, matGrid);*/

const botIni = document.getElementById("iniciar");
const botPausa = document.getElementById("pausar");
const botReini = document.getElementById("reiniciar");

let intervalo2 = null;

function main2(){

  if(intervalo2 !==null){
    clearInterval(intervalo2);
  };

  let tam = parseInt(configGame.getSize());
  let vel = parseInt(configGame.getSpeed());

  const coloresAct= [];

  for(let i=0; i < celdas.length; i++){

    let colact=getComputedStyle(celdas[i]).backgroundColor;
    coloresAct.push(colact);
  };

  let h = 0;  
  let matGrid = [];
  while(h < coloresAct.length){
    let aux = coloresAct.slice(h, h+tam);
    matGrid.push(aux);

    h+=tam;
  };

  //console.log(coloresAct);
  
  let matIter = createGrid(tam, matGrid);

  intervalo2 = setInterval(() => {
    matIter= gameOfLife(matIter);
    actualizarGrid(matIter);
  }, vel);
};

function actualizarGrid(matriz){

  //console.log(matriz);

  let arrAux=[];

  for(let i=1; i < matriz.length-1; i++){
    for(let j=1; j < matriz.length-1; j++){
      if(matriz[i][j]==="X"){
        arrAux.push("rgb(139, 139, 139)");
      }else if(matriz[i][j]==="O"){
        arrAux.push("rgb(235, 192, 0)");
      };

    };
  };

  for(let x=0; x< celdas.length; x++){
    celdas[x].style.backgroundColor = arrAux[x];
  };
  
};

function pausar(){

  if(intervalo2 !==null){
    clearInterval(intervalo2);
    intervalo2=null;
  }else{
    main2();
  };
  
};

function reiniciar(){

  //pausar();
  clearInterval(intervalo2);
  intervalo2=null;

  for(let i=0; i < celdas.length; i++){

    celdas[i].style.backgroundColor = "rgb(139, 139, 139)";
  };
};

botIni.addEventListener("click", main2);
botPausa.addEventListener("click", pausar);
botReini.addEventListener("click", reiniciar);


gridVisual();



