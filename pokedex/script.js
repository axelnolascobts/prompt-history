const xhr = new XMLHttpRequest();
let namepoke = document.getElementById("name");
const button = document.getElementById("search");
const poketipes = document.getElementById("types");
const pokeimg = document.getElementById("pokemonimage");
const pokename = document.getElementById("pokename");

button.onclick = () => {
    let input = namepoke.value;
xhr.open("GET", "https://pokeapi.co/api/v2/pokemon/"+input, true);
console.log(input);
xhr.onload = function () {
    if (xhr.status === 200){
console.log(xhr.responseText);
const datos = JSON.parse(xhr.responseText);
console.log(datos);

let tipos = "";
    for (let i = 0; i < datos.types.length; i++) {
    tipos += datos.types[i].type.name;
    if (i < datos.types.length - 1) {
            tipos += ", ";
         }
        }
poketipes.textContent = tipos;
pokename.textContent = datos.name;
pokeimg.src=datos.sprites.front_default;

}else{
    console.log("error");
poketipes.textContent = "no se encontro el Pokemon";
pokename.textContent = "";
pokeimg.src = "";
}
}
xhr.send();
}
/*
button.onclick = () => {
    let input = namepoke.value;

fetch("https://pokeapi.co/api/v2/pokemon/" + input)
     .then(function(response) {
        return response.json();
    })
    .then(function(datos) {
        let tipos = "";
        for (let i = 0; i < datos.types.length; i++) {
            tipos += datos.types[i].type.name;
                if (i < datos.types.length - 1) {
                    tipos += ", ";
            }
            }
        poketipes.textContent = tipos;
        pokename.textContent = datos.name;
        pokeimg.src = datos.sprites.front_default;
        })
        .catch(function(error) {
            poketipes.textContent = "no se encontro el pokemon";
            pokename.textContent = "";
            pokeimg.src = "";
        });
};
*/