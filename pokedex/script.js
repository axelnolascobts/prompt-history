const xhr = new XMLHttpRequest();
let namepoke = document.getElementById("name");
const button = document.getElementById("search");

button.onclick = () => {
    let input = namepoke.value;
xhr.open("GET", "https://pokeapi.co/api/v2/pokemon/"+input, true);
console.log(input);
xhr.onload = function () {
    if (xhr.status === 200){
console.log(xhr.responseText);
const datos = JSON.parse(xhr.responseText);
console.log(datos);
}else{
    console.log("error");
}
}
xhr.send();
}