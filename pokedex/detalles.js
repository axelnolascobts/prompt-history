const poketipes = document.getElementById("types");
const pokeimg_front = document.getElementById("pokemonimagefront");
const pokeimg_back = document.getElementById("pokemonimageback");
const pokeimg_front_Shiny = document.getElementById("pokemonimagefrontS");
const pokeimg_back_Shiny= document.getElementById("pokemonimagebackS");
const pokename = document.getElementById("pokename");
const pokenameList = document.getElementById("pokenameList");
const pokeweight = document.getElementById("weight")
const pokeheight = document.getElementById("height")  
const ability = document.getElementById("ability")

const param = new URLSearchParams(window.location.search);
const nameob = param.get("name");
//prueba para verificar que si reconoce el nombre
/*
console.log(nameob);
window.onload = () => {
fetch("https://pokeapi.co/api/v2/pokemon/" +nameob)
.then(function(response) {
    return response.json();
})
.then(function(datos) {
    let tipos = "";
    for (let i = 0; i < datos.types.length; i++) {
        tipos += datos.types[i].type.name;
            if (i < datos.types.length - 1) {
                tipos += ", ";
        }}
        let abilities = "";
        for (let j = 0; j < datos.abilities.length; j++) {
            abilities += datos.abilities[j].ability.name;
                if (j < datos.abilities.length - 1) {
                    abilities += ", ";
            }
        }
    poketipes.textContent = tipos;
    pokename.textContent = datos.name;
    pokeimg_front.src = datos.sprites.front_default;
    pokeimg_back.src = datos.sprites.back_default;
    pokeimg_front_Shiny.src = datos.sprites.front_shiny;
    pokeimg_back_Shiny.src = datos.sprites.back_shiny;
    pokeweight.textContent = datos.weight;
    pokeheight.textContent = datos.height;
    ability.textContent = abilities;

  })
};
*/

async function Datos_pokemon() {
    try {
      const RESPONSE = await fetch("https://pokeapi.co/api/v2/pokemon/" +nameob)
  
      if (!RESPONSE.ok) {
        throw new Error("No se encontró el Pokémon o hubo un error de conexión");
      }
  
      const DATA = await RESPONSE.json();

      let tipos = "";
      for (let i = 0; i < DATA.types.length; i++) {
          tipos += DATA.types[i].type.name;
              if (i < DATA.types.length - 1) {
                  tipos += ", ";
          }}
          let abilities = "";
          for (let j = 0; j < DATA.abilities.length; j++) {
              abilities += DATA.abilities[j].ability.name;
                  if (j < DATA.abilities.length - 1) {
                      abilities += ", ";
              }
          }
      poketipes.textContent = tipos;
      pokename.textContent = DATA.name;
      pokeimg_front.src = DATA.sprites.front_default;
      pokeimg_back.src = DATA.sprites.back_default;
      pokeimg_front_Shiny.src = DATA.sprites.front_shiny;
      pokeimg_back_Shiny.src = DATA.sprites.back_shiny;
      pokeweight.textContent = DATA.weight;
      pokeheight.textContent = DATA.height;
      ability.textContent = abilities;
    }
    catch (error) {
        console.error("Error cargando Pokémon:", error);
      }
};

window.onload = () => {
Datos_pokemon();
}