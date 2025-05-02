"use strict";

const contWins = (function(){
    let contX = 0;
    let contO = 0;
  
    return{
      incremetX(){
        contX++;
      },
      incremetO(){
        contO++;
      },
      getX(){
        return contX;
      },
      getO(){
        return contO;
      }
    };
  })();

const vicX = document.getElementById("victoriesX");
const vicO = document.getElementById("victoriesO");

vicX.textContent = `${contWins.getX}`;
vicO.textContent = `${contWins.getO}`;

let turn = 0;
const cells = document.getElementsByClassName("cell");
let colores=[];

const bot = document.getElementById("restartBot");
let turno = document.getElementById("turnoA");

function turnoDe(){
    if(turn%2 ===0){
        turno.textContent="Turno de X";
    }else if(turn%2 !==0){
        turno.textContent="Turno de O"
    };
    
}
turnoDe();

function setEvento(){
    
    
    for(let i =0; i<cells.length; i++){
        cells[i].onclick = () => {
            let col =  getComputedStyle(cells[i]).backgroundColor;
            turnoDe();

            if(col==="rgb(102, 102, 102)" && turn%2 ===0){ //Hay que validar si es X/O también
                cells[i].style.backgroundColor = "rgb(209, 5, 5)";
                cells[i].textContent = "X";
                turn++;
                winLose();
            }else if(col==="rgb(102, 102, 102)" && turn%2 !==0){
                cells[i].style.backgroundColor = "rgb(0, 46, 199)";
                cells[i].textContent = "O";
                turn++;
                winLose();
            };

        };

    };
    
};

setEvento();

function winLose(){
    let narr = [];
    for(let x = 0; x < cells.length; x++){
        let col =  getComputedStyle(cells[x]).backgroundColor;

        narr.push(col);
    }
    
    let h = 0;  
    let matriz= [];
    while(h < narr.length){
      let aux = narr.slice(h, h+3);
      matriz.push(aux);
  
      h+=3;
    };

    console.log(turn);

    for(let fil=0; fil<3; fil++){
        
        if(matriz[fil][0] === matriz[fil][1] && matriz [fil][1] === matriz[fil][2] && 
            matriz[fil][2] !== "rgb(102, 102, 102)"){
                //aqui pasa algo xd

        };
    };

    for(let colu=0; colu<3; colu++){
        if(matriz[0][colu] === matriz[1][colu] && matriz [1][colu] === matriz[2][colu] && 
            matriz[2][colu] !== "rgb(102, 102, 102)"){
                //aqui pasa algo xd

        };

    };

    if(matriz[0][0]=== matriz[1][1] && matriz [1][1] === matriz[2][2] 
        && matriz[2][2]!=="rgb(102, 102, 102)" || matriz[2][0]=== matriz[1][1] && 
        matriz [1][1] === matriz[0][2] && matriz[0][2]!=="rgb(102, 102, 102)" ){}
    
    
    
    
};