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

vicX.textContent = `${contWins.getX()}`;
vicO.textContent = `${contWins.getO()}`;

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
            //let col =  getComputedStyle(cells[i]).backgroundColor;
            
            if(cells[i].textContent === "" && turn%2 ===0){ //Hay que validar si es X/O también
                //cells[i].style.backgroundColor = "rgb(209, 5, 5)";
                cells[i].textContent = "X";
                turn++;
                turnoDe();
                winLose();
            }else if(cells[i].textContent === "" && turn%2 !==0){
                //cells[i].style.backgroundColor = "rgb(0, 46, 199)";
                cells[i].textContent = "O";
                turn++;
                turnoDe();
                winLose();
            };

        };

    };
    
};

setEvento();

function winLose(){
    let narr = [];
    for(let x = 0; x < cells.length; x++){

        narr.push(cells[x].textContent);
    };
    
    let h = 0;  
    let matriz= [];
    while(h < narr.length){
      let aux = narr.slice(h, h+3);
      matriz.push(aux);
  
      h+=3;
    };

    console.log(turn);
    console.log(matriz);

    for(let fil=0; fil<3; fil++){
        
        if(matriz[fil][0] === matriz[fil][1] && matriz [fil][1] === matriz[fil][2] && 
            matriz[fil][2] !== ""){

                for(let ax=fil*3; ax<fil*3+3; ax++){
                    //console.log(ax);

                    cells[ax].style.color = "rgb(40, 172, 0)";
                }
        
                if(turn%2 ===0){
                    contWins.incremetO();
                    vicO.textContent = `${contWins.getO()}`;
                    turno.textContent="GANA O !!!"
                }else if(turn%2 !==0){
                    contWins.incremetX();
                    vicX.textContent = `${contWins.getX()}`;
                    turno.textContent="GANA X !!!"
                };
                terminarJuego(narr);
                return;
        };
        
    };

    for(let colu=0; colu<3; colu++){
        if(matriz[0][colu] === matriz[1][colu] && matriz [1][colu] === matriz[2][colu] && 
            matriz[2][colu] !== ""){

                for(let ax=colu; ax<9; ax+=3){
                    //console.log(ax);
                    cells[ax].style.color = "rgb(40, 172, 0)";
                
                }
                
                if(turn%2 ===0){
                    contWins.incremetO();
                    vicO.textContent = `${contWins.getO()}`;
                    turno.textContent="GANA O !!!"
                }else if(turn%2 !==0){
                    contWins.incremetX();
                    vicX.textContent = `${contWins.getX()}`;
                    turno.textContent="GANA X !!!"
                };
                terminarJuego(narr);
                return;
        };
        

    };

    if(matriz[0][0]=== matriz[1][1] && matriz [1][1] === matriz[2][2] 
        && matriz[2][2]!=="" || matriz[2][0]=== matriz[1][1] && 
        matriz [1][1] === matriz[0][2] && matriz[0][2]!=="" ){

            if(matriz[0][0]=== matriz[1][1]){
                cells[0].style.color = "rgb(40, 172, 0)";
                cells[4].style.color = "rgb(40, 172, 0)";
                cells[8].style.color = "rgb(40, 172, 0)";
            }else{
                cells[2].style.color = "rgb(40, 172, 0)";
                cells[4].style.color = "rgb(40, 172, 0)";
                cells[6].style.color = "rgb(40, 172, 0)";
            };

            if(turn%2 ===0){
                contWins.incremetO();
                vicO.textContent = `${contWins.getO()}`;
                turno.textContent="GANA O !!!"
            }else if(turn%2 !==0){
                contWins.incremetX();
                vicX.textContent = `${contWins.getX()}`;
                turno.textContent="GANA X !!!"
            };
            terminarJuego(narr);
            return;
        }
    

    if(evaluarEmpate(narr)){
            
        turno.textContent="EMPATE !!!";
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
    for(let i=0; i<cells.length; i++){
        if(array[i] === ""){
            cells[i].textContent = " ";
        }

    };

}

bot.onclick = () => {
    for(let i=0; i<cells.length; i++){
        cells[i].textContent = "";
        cells[i].style.color = "black";
    };
    turn = 0;
    turnoDe();
    setEvento();
};
