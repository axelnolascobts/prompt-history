const XHR = new XMLHttpRequest();
let namepoke = document.getElementById("name");
const BUTTON = document.getElementById("search");
const POKETYPES = document.getElementById("types");
const POKEIMG = document.getElementById("pokemonimage");
const POKENAME = document.getElementById("pokename");
const POKENAMELIST = document.getElementById("pokenamelist");
/*
BUTTON.onclick = () => {
    let input = namepoke.value;
XHR.open("GET", "https://pokeapi.co/api/v2/pokemon/"+input, true);
console.log(input);
XHR.onload = function () {
    if (XHR.status === 200){
console.log(XHR.responseText);
const datos = JSON.parse(XHR.responseText);
console.log(datos);

let tipos = "";
    for (let i = 0; i < datos.types.length; i++) {
    tipos += datos.types[i].type.name;
    if (i < datos.types.length - 1) {
            tipos += ", ";
         }
        }
POKETYPES.textContent = tipos;
POKENAME.textContent = datos.name;
POKEIMG.src=datos.sprites.front_shiny;

}else{
    console.log("error");
POKETYPES.textContent = "no se encontro el Pokemon";
POKENAME.textContent = "";
POKEIMG.src = "";
}
}
XHR.send();
}
*/

//al cargar la pagina hace las peticiones con fetch de los primeros 20 pokemon
/*
window.onload = () => {
    const container = document.getElementById("pokemonGrid");
  */
  /*nota: en este caso el offset no es necesario ya que si lo retiramos por default inicia en el 01
  pero si cambias su valor a otro desde iniciaria por ID*/
  /*
fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")
    .then(response => response.json())
    .then(data => {
        const requests = [];
  
        for (let i = 0; i < data.results.length; i++) {
          requests.push(fetch(data.results[i].url).then(res => res.json()));
        }
        //renderiza todos los datos y una vez termine ya los carga
        Promise.all(requests).then(pokemons => {
          for (let i = 0; i < pokemons.length; i++) {
            const poke = pokemons[i];
            const link = document.createElement("a");
            link.href = `detalles.html?name=${poke.name}`;
            link.className = "card";
            //igual que la funcion
            let tipos = "";
            for (let j = 0; j < poke.types.length; j++) {
              tipos += poke.types[j].type.name;
              if (j < poke.types.length - 1) tipos += ", ";
            }
            //inserta en el html el sprite, nombre y tipos
            link.innerHTML = `<img src="${poke.sprites.front_default}">
              <p>${poke.name}</p>
              <p>types:</p>
              <p>${tipos}</p>`;
  
            container.appendChild(link);
          }
        });
      })
      .catch(error => {
        console.error("Error cargando Pokémon:", error);
      });
  };
*/
/*
BUTTON.onclick = () => {
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
        POKETYPES.textContent = tipos;
        POKENAME.textContent = datos.name;
        POKEIMG.src = datos.sprites.front_default;
        })
        .catch(function(error) {
            POKETYPES.textContent = "no se encontro el pokemon";
            POKENAME.textContent = "";
            POKEIMG.src = "";
        });
};
*/

// funcion async para mostrar un pokemon
  async function Mostrar_un_Pokemon(input) {

  try {

  const RESPONSE = await fetch("https://pokeapi.co/api/v2/pokemon/" + input);
  if(!RESPONSE.ok){

  throw new Error("No se encontro el pokemon o error de conexion");
}

  const DATA = await RESPONSE.json();

  let tipos = "";

  for (let i = 0; i < DATA.types.length; i++) {
    tipos += DATA.types[i].type.name;
        if (i < DATA.types.length - 1) {
            tipos += ", ";
    }

    }
    POKETYPES.textContent = tipos;
    POKENAME.textContent = DATA.name;
    POKEIMG.src = DATA.sprites.front_default;
}
catch (error){
  POKETYPES.textContent = "no se encontro el pokemon";
  POKENAME.textContent = "";
  POKEIMG.src = "";
}
};


BUTTON.onclick = () => {  
  let input = namepoke.value;
Mostrar_un_Pokemon(input);
}



async function Lista_de_pokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  try {
    const RESPONSE = await fetch(url);

    if (!RESPONSE.ok) {
      throw new Error("No se encontró el Pokémon o hubo un error de conexión");
    }

    const DATA = await RESPONSE.json();

    const requests = DATA.results.map(poke => fetch(poke.url));
    const responses = await Promise.all(requests);
    const pokemons = await Promise.all(responses.map(res => res.json()));


    const container = document.getElementById("pokemonGrid");

    for (let i = 0; i < pokemons.length; i++) {
      const poke = pokemons[i];
      const link = document.createElement("a");
      link.href = `detalles.html?name=${poke.name}`;
      link.className = "card";

      let tipos = "";
      for (let j = 0; j < poke.types.length; j++) {
        tipos += poke.types[j].type.name;
        if (j < poke.types.length - 1) tipos += ", ";
      }

      link.innerHTML = `
        <img src="${poke.sprites.front_default}">
        <p>${poke.name}</p>
        <p>Types:</p>
        <p>${tipos}</p>`;

      container.appendChild(link);
    }

  } 
  catch (error) {
    console.error("Error cargando Pokémon:", error);
  }
};

window.onload = () => {
Lista_de_pokemon();
}