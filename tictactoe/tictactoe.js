"use strict";

const winsCounter = (function(){
    let countWinsX = 0;
    let countWinsO = 0;
  
    return {
      incrementWinX(){
        countWinsX++;
      },
      incrementWinO(){
        countWinsO++;
      },
      getWinsX(){
        return countWinsX;
      },
      getWinsO(){
        return countWinsO;
      }
    }
  })();

const VICTORIESX = document.getElementById("victoriesX");
const VICTORIESO = document.getElementById("victoriesO");

VICTORIESX.textContent = `${winsCounter.getWinsX()}`;
VICTORIESO.textContent = `${winsCounter.getWinsO()}`;

let turn = 0;
const CELLS = document.getElementsByClassName("cell");
//let colores=[];

const RESTARTBUTTON = document.getElementById("restartBot");
let showTurnLabel = document.getElementById("turnoA");

function printTurnOf() {
    if (turn % 2 === 0) {
        showTurnLabel.textContent="Turno de X";
    } else if (turn % 2 !== 0) {
        showTurnLabel.textContent="Turno de O";
    }
}

printTurnOf();

function setEventToClickCells() {
    
    for (let i = 0; i < CELLS.length; i++) {
        CELLS[i].onclick = () => {
            //let col =  getComputedStyle(CELLS[i]).backgroundColor;
            
            if (CELLS[i].textContent === "" && turn % 2 === 0) { //Hay que validar si es X/O también
                //CELLS[i].style.backgroundColor = "rgb(209, 5, 5)";
                CELLS[i].textContent = "X";
                turn++;
                printTurnOf();
                winLose();
            } else if (CELLS[i].textContent === "" && turn % 2 !== 0) {
                //CELLS[i].style.backgroundColor = "rgb(0, 46, 199)";
                CELLS[i].textContent = "O";
                turn++;
                printTurnOf();
                winLose();
            }
        }
    }
}

setEventToClickCells();

function createMatriz() { //Esta función aún no se usa, seguir desglozando winLose()
    
    let auxiliarArray = [];

    for (let x = 0; x < CELLS.length; x++) {

        auxiliarArray.push(CELLS[x].textContent);
    }
    
    let cutter = 0;  
    let matriz= [];

    while (cutter < auxiliarArray.length) {
      let auxiliarElement = auxiliarArray.slice(cutter, cutter+3);
      matriz.push(auxiliarElement);
  
      cutter+=3;
    }
}

function winLose() {
    let auxiliarArray = [];
    for(let x = 0; x < CELLS.length; x++){

        auxiliarArray.push(CELLS[x].textContent);
    };
    
    let cutter = 0;  
    let matriz= [];
    while(cutter < auxiliarArray.length){
      let auxiliarElement = auxiliarArray.slice(cutter, cutter+3);
      matriz.push(auxiliarElement);
  
      cutter+=3;
    };

    console.log(turn);
    console.log(matriz);

    for(let fil=0; fil<3; fil++){
        
        if(matriz[fil][0] === matriz[fil][1] && matriz [fil][1] === matriz[fil][2] && 
            matriz[fil][2] !== ""){

                for(let ax=fil*3; ax<fil*3+3; ax++){
                    //console.log(ax);

                    CELLS[ax].style.color = "rgb(40, 172, 0)";
                    //CELLS[ax].style.border = "3px solid rgb(40, 172, 0)"
                }
        
                if(turn%2 ===0){
                    winsCounter.incrementWinO();
                    VICTORIESO.textContent = `${winsCounter.getWinsO()}`;
                    showTurnLabel.textContent="GANA O !!!"
                }else if(turn%2 !==0){
                    winsCounter.incrementWinX();
                    VICTORIESX.textContent = `${winsCounter.getWinsX()}`;
                    showTurnLabel.textContent="GANA X !!!"
                };
                terminarJuego(auxiliarArray);
                return;
        };
        
    };

    for(let colu=0; colu<3; colu++){
        if(matriz[0][colu] === matriz[1][colu] && matriz [1][colu] === matriz[2][colu] && 
            matriz[2][colu] !== ""){

                for(let ax=colu; ax<9; ax+=3){
                    //console.log(ax);
                    CELLS[ax].style.color = "rgb(40, 172, 0)";
                
                }
                
                if(turn%2 ===0){
                    winsCounter.incrementWinO();
                    VICTORIESO.textContent = `${winsCounter.getWinsO()}`;
                    showTurnLabel.textContent="GANA O !!!"
                }else if(turn%2 !==0){
                    winsCounter.incrementWinX();
                    VICTORIESX.textContent = `${winsCounter.getWinsX()}`;
                    showTurnLabel.textContent="GANA X !!!"
                };
                terminarJuego(auxiliarArray);
                return;
        };
        

    };

    if(matriz[0][0]=== matriz[1][1] && matriz [1][1] === matriz[2][2] 
        && matriz[2][2]!=="" || matriz[2][0]=== matriz[1][1] && 
        matriz [1][1] === matriz[0][2] && matriz[0][2]!=="" ){

            if(matriz[0][0]=== matriz[1][1]){
                CELLS[0].style.color = "rgb(40, 172, 0)";
                CELLS[4].style.color = "rgb(40, 172, 0)";
                CELLS[8].style.color = "rgb(40, 172, 0)";
            }else{
                CELLS[2].style.color = "rgb(40, 172, 0)";
                CELLS[4].style.color = "rgb(40, 172, 0)";
                CELLS[6].style.color = "rgb(40, 172, 0)";
            };

            if(turn%2 ===0){
                winsCounter.incrementWinO();
                VICTORIESO.textContent = `${winsCounter.getWinsO()}`;
                showTurnLabel.textContent="GANA O !!!"
            }else if(turn%2 !==0){
                winsCounter.incrementWinX();
                VICTORIESX.textContent = `${winsCounter.getWinsX()}`;
                showTurnLabel.textContent="GANA X !!!"
            };
            terminarJuego(auxiliarArray);
            return;
        }
    

    if(evaluarEmpate(auxiliarArray)){
            
        showTurnLabel.textContent="EMPATE !!!";
    };
    
    
};

function evaluarEmpate(array){
    for(let i=0; i<array.length; i++){
        if(array[i] === ""){
            return false;
        };
    }
    return true;
};

function terminarJuego(array){
    for(let i=0; i<CELLS.length; i++){
        if(array[i] === ""){
            CELLS[i].textContent = " ";
        }

    };

}

RESTARTBUTTON.onclick = () => {
    for(let i=0; i<CELLS.length; i++){
        CELLS[i].textContent = "";
        CELLS[i].style.color = "black";
    };
    turn = 0;
    printTurnOf();
    setEventToClickCells();
};
