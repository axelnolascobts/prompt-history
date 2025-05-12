const XHR = new XMLHttpRequest();

let namepoke = document.getElementById("name");
const BUTTON = document.getElementById("search");
const POKETYPES = document.getElementById("types");
const POKEIMG = document.getElementById("pokemonimage");
const POKENAME = document.getElementById("pokename");
const POKENAMELIST = document.getElementById("pokenamelist");
const GRID = document.getElementById("pokemonGrid");
const SELECT_COUNT = document.getElementById("pokemonCountSelect");

/**
 * Función para mostrar los datos de un Pokémon
 */
async function Mostrar_un_Pokemon(input) {
    try {
        const RESPONSE = await fetch("https://pokeapi.co/api/v2/pokemon/" + input.toLowerCase());
        
        if (!RESPONSE.ok) {
            throw new Error("No se encontró el Pokémon o error de conexión");
        }

        const DATA = await RESPONSE.json();

        // Obtener los tipos
        let tipos = DATA.types.map(t => t.type.name).join(", ");

        // Crear contenedor de Pokémon
        const CARD = document.createElement("a");
        CARD.className = "card";
        CARD.href = `detalles.html?name=${DATA.name}`;

        CARD.innerHTML = `
            <img src="${DATA.sprites.front_default}" alt="${DATA.name}">
            <h3>${DATA.name}</h3>
            <p>Tipo: ${tipos}</p>
        `;

        GRID.appendChild(CARD);

    } catch (error) {
        const ERROR_MSG = document.createElement("div");
        ERROR_MSG.className = "card";
        ERROR_MSG.textContent = "No se encontró el Pokémon";
        GRID.appendChild(ERROR_MSG);
    }
}

/**
 * Función para cargar una lista de Pokémon según el número seleccionado
 */
async function Lista_de_pokemon(cantidad = 20) {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${cantidad}&offset=0`;

    try {
        const RESPONSE = await fetch(url);

        if (!RESPONSE.ok) {
            throw new Error("No se encontraron Pokémon o error de conexión");
        }

        const DATA = await RESPONSE.json();
        const requests = DATA.results.map(poke => fetch(poke.url));
        const responses = await Promise.all(requests);
        const pokemons = await Promise.all(responses.map(res => res.json()));

        // Obtener el contenedor donde se mostrarán los Pokémon
        const container = document.getElementById("pokemonGrid");
        container.innerHTML = ""; // Limpiar el grid

        // Insertar los Pokémon en el contenedor
        pokemons.forEach(poke => {
            const link = document.createElement("a");
            link.href = `detalles.html?name=${poke.name}`;
            link.className = "card";

            let tipos = "";
            poke.types.forEach((type, index) => {
                tipos += type.type.name;
                if (index < poke.types.length - 1) tipos += ", ";
            });

            link.innerHTML = `
                <img src="${poke.sprites.front_default}" alt="${poke.name} image">
                <p>${poke.name}</p>
                <p>Tipos: ${tipos}</p>
            `;

            container.appendChild(link);
        });

        // Ajustar el grid para siempre tener 4 columnas
        adjustGridLayout();

    } catch (error) {
        console.error("Error cargando Pokémon:", error);
    }
}

/**
 * Función para ajustar el grid a 4 columnas siempre
 */
function adjustGridLayout() {
    // Establecer siempre 4 columnas
    GRID.style.gridTemplateColumns = "repeat(4, 1fr)";
}

/**
 * Función para cargar los tipos disponibles
 */
async function Cargar_tipos() {
    const SELECT = document.getElementById("typeFilter");

    try {
        const RESPONSE = await fetch("https://pokeapi.co/api/v2/type");
        const DATA = await RESPONSE.json();

        DATA.results.forEach(tipo => {
            const OPTION = document.createElement("option");
            OPTION.value = tipo.name;
            OPTION.textContent = tipo.name.charAt(0).toUpperCase() + tipo.name.slice(1);
            SELECT.appendChild(OPTION);
        });
    } catch (error) {
        console.error("Error cargando tipos de Pokémon:", error);
    }
}

/**
 * Función para activar/desactivar el modo oscuro
 */
function modes() {
    const carcasa = document.querySelector(".pokedex_carcasa");
    carcasa.classList.toggle("dark-mode");
  
    const gridDark = document.querySelector(".pokemonGrid");
    if (gridDark) {
        gridDark.classList.toggle("dark-mode");
    }

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.classList.toggle("dark-mode");
    });
}

/**
 * Asignar el evento de cambio al filtro de tipo
 */
document.getElementById("typeFilter").addEventListener("change", (event) => {
    const tipoSeleccionado = event.target.value;  // Obtener el tipo seleccionado
    Lista_de_pokemon(20, tipoSeleccionado);  // Volver a cargar los Pokémon con el tipo seleccionado
});

/**
 * Asignar el evento de cambio al select para elegir la cantidad de Pokémon
 */
SELECT_COUNT.addEventListener("change", (event) => {
    const cantidadSeleccionada = event.target.value; // Obtener la cantidad seleccionada
    Lista_de_pokemon(cantidadSeleccionada); // Volver a cargar los Pokémon con la cantidad seleccionada
});

/**
 * Asignar el evento de click al botón para mostrar el Pokémon
 */
BUTTON.onclick = () => {
    const input = namepoke.value;  // Obtener el valor del input y eliminar espacios
    GRID.innerHTML = ""; // Limpiar el grid
    GRID.style.gridTemplateColumns = "repeat(1, 1fr)"; // Ajustar el diseño de la cuadrícula
    GRID.classList.add("solo"); // Activar estilo más pequeño
    
    // Solo hacer la búsqueda si se ingresó un nombre
    if (input) {
        Mostrar_un_Pokemon(input);
    } else {
        // Si no se ingresó nombre, cargar los Pokémon según la selección
        const cantidad = SELECT_COUNT.value;
        Lista_de_pokemon(cantidad);
    }
};

// Cargar los primeros 20 Pokémon y tipos al cargar la página
window.onload = () => {
    Lista_de_pokemon();  // Cargar los primeros 20 Pokémon
    Cargar_tipos();      // Cargar los tipos disponibles para filtrar
    
    const darkModeButton = document.getElementById("darkModeButton");
    darkModeButton.addEventListener("click", modes);  // Botón para activar/desactivar modo oscuro
};


/**
 * Parte inhabilitada del código
 */

/*
BUTTON.onclick = () => {
    let input = namepoke.value;

    XHR.open("GET", "https://pokeapi.co/api/v2/pokemon/" + input, true);
    console.log(input);
    
    XHR.onload = function () {
        if (XHR.status === 200) {
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
            POKEIMG.src = datos.sprites.front_shiny;

        } else {
            console.log("error");
            POKETYPES.textContent = "No se encontró el Pokémon";
            POKENAME.textContent = "";
            POKEIMG.src = "";
        }
    };

    XHR.send();
}
*/

/*
window.onload = () => {
    const container = document.getElementById("pokemonGrid");

    // Nota: en este caso el offset no es necesario, ya que por defecto inicia en el 01.
    // Pero si cambias su valor a otro, desde ahí iniciaría por ID.

    fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")
        .then(response => response.json())
        .then(data => {
            const requests = [];

            for (let i = 0; i < data.results.length; i++) {
                requests.push(fetch(data.results[i].url).then(res => res.json()));
            }

            // Renderiza todos los datos y una vez termine, ya los carga
            Promise.all(requests).then(pokemons => {
                for (let i = 0; i < pokemons.length; i++) {
                    const poke = pokemons[i];
                    const link = document.createElement("a");
                    link.href = `detalles.html?name=${poke.name}`;
                    link.className = "card";

                    // Igual que la función
                    let tipos = "";
                    for (let j = 0; j < poke.types.length; j++) {
                        tipos += poke.types[j].type.name;
                        if (j < poke.types.length - 1) tipos += ", ";
                    }

                    // Inserta en el HTML el sprite, nombre y tipos
                    link.innerHTML = `<img src="${poke.sprites.front_default}">
                        <p>${poke.name}</p>
                        <p>Tipos:</p>
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
            POKETYPES.textContent = "No se encontró el Pokémon";
            POKENAME.textContent = "";
            POKEIMG.src = "";
        });
};
*/

