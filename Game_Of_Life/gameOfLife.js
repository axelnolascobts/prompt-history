"use strict";

//console.log(matriz);

function liveCells(matriz){
    for(let fila of matriz){
        let n = Math.floor(Math.random()*20);

        for(let x = 0; x < n; x++){
            let liveCell = Math.floor(Math.random()*20);

            fila[liveCell]="O";

        };
    };
};



function showGrid(matriz){
    for(let i = 0; i<20; i++ ){
        let fila='|';
    
        for(let j=0; j<20; j++){
            fila+=' '+matriz[i][j]+' |';
        };
        console.log(fila);
        
    };
    console.log(" ");
    
};


function gameOfLife(matriz){
    let newMatriz = Array.from({ length: 20 }, () => Array(20).fill(" "));

    for(let row=0; row<20; row++){
        for(let col=0; col<20; col++){
            let aliveNeighbors = 0;
            const actual=matriz[row][col];
            //console.log(aliveNeighbors);

            if(row==0 && col == 0){
                aliveNeighbors+=hiNeighbors(matriz[row][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col+1]);

            }else if(row==0 && col==19){
                aliveNeighbors+=hiNeighbors(matriz[row][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col]);
            }else if(row ==19 && col== 0){
                aliveNeighbors+=hiNeighbors(matriz[row-1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col+1]);
            }else if(row==19 && col ==19){
                aliveNeighbors+=hiNeighbors(matriz[row-1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row][col-1]);
            }else if(row == 0){
                aliveNeighbors+=hiNeighbors(matriz[row][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col+1]);
            }else if(col == 0){
                aliveNeighbors+=hiNeighbors(matriz[row-1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col+1]);
            }else if(row == 19){
                aliveNeighbors+=hiNeighbors(matriz[row-1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col+1]);
            }else if(col ==19){
                aliveNeighbors+=hiNeighbors(matriz[row-1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col]);
            }else{
                aliveNeighbors+=hiNeighbors(matriz[row-1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row-1][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row][col+1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col-1]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col]);
                aliveNeighbors+=hiNeighbors(matriz[row+1][col+1]);

            };

            //console.log(aliveNeighbors);
            if(actual==="X" && aliveNeighbors===3){
                newMatriz[row][col]="O";
            }else if(actual==="O" && aliveNeighbors < 2 || actual==="O" && aliveNeighbors > 3){
                newMatriz[row][col]="X";
            }else if(actual==="O" && aliveNeighbors===2 || actual==="O" && aliveNeighbors===3){
                newMatriz[row][col]="O";
            }else{
                newMatriz[row][col]=matriz[row][col];
            };
            
        };
    };
    
    let ev = evaluateLife(matriz, newMatriz);

    if(ev===false){
        console.clear();
        showGrid(newMatriz);
        return newMatriz;
    }else if(ev===true){
        //console.clear();
        clearInterval(intervalo);
        console.log("Game Over");
        return matriz;
    };
    

};

function hiNeighbors(value){
    
    if(value==="O"){
        return 1;
    }else if(value==="X"){
        return 0;
    };
    return 0;
};

function evaluateLife(matrizO, matrizN){
    for(let i=0; i<19; i++){
        for(let j=0; j<19; j++){

            if(matrizN[i][j]!==matrizO[i][j]){
                return false;
            };
            
        };
    };
    return true;

};


let intervalo = null;
let run = false;
let matriz = Array.from({ length: 20 }, () => Array(20).fill("X"));

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', function(tecla) {
    const key = tecla.toString();

    if (key === "s" || key === "S") {
        if (!run) {
            intervalo = setInterval(() => {
                matriz = gameOfLife(matriz);
            }, 500);
            run = true;
        } else {
            clearInterval(intervalo);
            run = false;
        }
    } else if (key === "r" || key === "R") {
        clearInterval(intervalo);
        matriz = Array.from({ length: 20 }, () => Array(20).fill("X"));
        liveCells(matriz);
        showGrid(matriz);
        run = false;
    } else if (key === "e" || key === "E") {
        process.exit();
    }
});


liveCells(matriz);
showGrid(matriz);