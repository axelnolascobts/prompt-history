function cell(){
let cellprint;
let celula = Math.random () * 1.0
if (celula < 0.5) {
cellprint = "X";
return cellprint;
} else {
cellprint = "O";  
return cellprint;
} 
}
function neighborsO() { 
let conteo = 0;

const coords =
[
[1, 0],
[1, -1],
[1, 1],
[0, -1],
[0, 1],
[-1, 0],
[-1, -1],
];

if(coords[1, 0] === "O"){
conteo += 1;
}
if(coords[1, -1] === "O"){
    conteo += 1;
}
if(coords[1, 1] === "O"){
    conteo += 1;
}
if(coords[0, -1] === "O"){
    conteo += 1;
}
if(coords[0, 1] === "O"){
    conteo += 1;
}
if(coords[-1, 0] === "O"){
    conteo += 1;
}
if(coords[-1, 1] === "O"){
    conteo += 1;
}
if(coords[-1, -1] === "O"){
    conteo += 1;
}
}
function grid(tamano){
    let newarr = [];
    let arr = [];
    for (let i=0; i<tamano; i++){
    arr[i]=[];
    for (let j=0; j<tamano; j++){
    arr[i][j] = cell();
    }
    }
    console.log("generando array",(arr));
    rules(arr);
    newarr=arr;
    console.log(newarr);
    infinite();
}
function rules(){
    if(cell() === "X" && neighborsO() === 3){
        cell() = "O"
        }if (cell() === "O" && neighborsO() >= 4){
        cell() = "X"
        }if (cell() === "O" && neighborsO() < 2){
        cell() = "X"
        }if (cell() === "O" && neighborsO() === 2 || neighborsO() === 3){
        cell() = "O"
        }
    }
function infinite(){
for(let t = 0; t<Infinity; t++){
grid();
}
}
console.log(grid(10));