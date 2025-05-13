const POKETYPES = document.getElementById("types");
const POKEMON_NAME = document.getElementById("pokename");
const POKEMON_WEIGHT = document.getElementById("weight");
const POKEMON_HEIGHT = document.getElementById("height");
const POKEMON_ABILITY = document.getElementById("ability");
const SPRITES_CONTAINER = document.getElementById("sprites");
document.getElementById("darkModeButton").addEventListener("click", modes);


const param = new URLSearchParams(window.location.search);
const nameob = param.get("name");

async function Datos_pokemon() {
    try {
      const RESPONSE = await fetch("https://pokeapi.co/api/v2/pokemon/" + nameob);
  
      if (!RESPONSE.ok) {
        throw new Error("No se encontró el Pokémon o hubo un error de conexión");
      }
  
      const DATA = await RESPONSE.json();
  
      const tipos = DATA.types.map(t => t.type.name).join(", ");
      const abilities = DATA.abilities.map(a => a.ability.name).join(", ");
  
      POKETYPES.textContent = tipos;
      POKEMON_NAME.textContent = DATA.name;
      POKEMON_WEIGHT.textContent = DATA.weight;
      POKEMON_HEIGHT.textContent = DATA.height;
      POKEMON_ABILITY.textContent = abilities;
  
      show_Sprites(DATA.sprites, SPRITES_CONTAINER);

  
    } catch (error) {
      console.error("Error cargando Pokémon:", error);
    }
  }
  
  // Botón para alternar modo oscuro
    function modes() {
    const carcasa = document.querySelector(".pokedex_carcasa_2");
    carcasa.classList.toggle("dark-mode-1");

}
  window.onload = () => {
    Datos_pokemon();
  };
  
  function show_Sprites(sprites, contenedor) {
    
    for (let nombre in sprites) {
     
      let url = sprites[nombre];
  
     
      if (typeof url === "string" && url.endsWith(".png")) {
      
        let imagen = document.createElement("img");
        imagen.src = url;
        imagen.alt = nombre;
        imagen.className = "pokemon-image";
  
        
        let texto = document.createElement("p");
        texto.textContent = nombre.replaceAll("_", " ");
  
        
        let item = document.createElement("div");
        item.className = "sprite-item";
        item.appendChild(texto);
        item.appendChild(imagen);
  
       
        contenedor.appendChild(item);
      }
    }
  }
  

  // Prueba para verificar que si reconoce el nombre
/*
console.log(nameob);
window.onload = () => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + nameob)
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

            let abilities = "";
            for (let j = 0; j < datos.abilities.length; j++) {
                abilities += datos.abilities[j].POKEMON_ABILITY.name;
                if (j < datos.abilities.length - 1) {
                    abilities += ", ";
                }
            }

            POKETYPES.textContent = tipos;
            pokename.textContent = datos.name;
            POKEIMAGE_FRONT.src = datos.sprites.front_default;
            POKE_IMAGE_BACK_SHINY.src = datos.sprites.back_default;
            POKE_IMAGE_FRONT_SHINY.src = datos.sprites.front_shiny;
            POKE_IMAGE_BACK_SHINY.src = datos.sprites.back_shiny;
            POKEMON_WEIGHT.textContent = datos.weight;
            pokeheight.textContent = datos.height;
            POKEMON_ABILITY.textContent = abilities;
        });
};
*/