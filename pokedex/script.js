const XHR = new XMLHttpRequest();
let namepoke = document.getElementById("name");
const BUTTON = document.getElementById("search");
const POKEIMG = document.getElementById("pokemonimage");
const POKENAME = document.getElementById("pokename");
const GRID = document.getElementById("pokemonGrid");
const SELECT_COUNT = document.getElementById("pokemonCountSelect");
const SELECT_TYPE = document.getElementById("typeFilter");
const NEXT_BTN = document.getElementById("nextBtn");
const PREV_BTN = document.getElementById("prevBtn");

const PAGE_INDICATOR = document.getElementById("pagination");

let pagina_actual = 1;
let listaPokemonTipo = []; // Lista cacheada de Pokémon por tipo
let totalPokemon = 0; // Total de Pokémon disponibles

// Lista de Pokémon con paginación y tipo opcional
async function Lista_de_pokemon(cantidad = 20, tipo = "", pagina = 1) {
    try {
        GRID.innerHTML = ""; // Limpiar el grid
        const offset = (pagina - 1) * cantidad;

        if (tipo && tipo !== "") {
            // Si es la primera vez o se cambió de tipo, recarga la lista
            if (listaPokemonTipo.length === 0 || tipo !== listaPokemonTipo.tipoActual) {
                const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
                if (!res.ok) throw new Error("No se pudo obtener el tipo");
                const data = await res.json();
                listaPokemonTipo = data.pokemon.map(p => p.pokemon);
                totalPokemon = listaPokemonTipo.length; // Actualiza el total de Pokémon por tipo
                listaPokemonTipo.tipoActual = tipo; // Etiqueta para saber si cambió
            }

            const subset = listaPokemonTipo.slice(offset, offset + cantidad);
            const requests = subset.map(p => fetch(p.url));
            const responses = await Promise.all(requests);
            const pokemons = await Promise.all(responses.map(r => r.json()));
            pokemons.forEach(crearTarjetaPokemon);
        } else {
            // Reset cache si no hay tipo
            listaPokemonTipo = [];
            totalPokemon = 0;

            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cantidad}&offset=${offset}`);
            if (!res.ok) throw new Error("No se pudieron obtener Pokémon");
            const data = await res.json();
            totalPokemon = data.count; // Total de Pokémon disponible sin filtro
            const requests = data.results.map(poke => fetch(poke.url));
            const responses = await Promise.all(requests);
            const pokemons = await Promise.all(responses.map(r => r.json()));
            pokemons.forEach(crearTarjetaPokemon);
        }

        adjustGridLayout();
    } catch (error) {
        console.error("Error cargando Pokémon:", error);
    }
}

// Crea la tarjeta Pokémon con loader de sprite
function crearTarjetaPokemon(poke) {
    const link = document.createElement("a");
    link.href = `detalles.html?name=${poke.name}`;
    link.className = "card";

    const tipos = poke.types.map(t => t.type.name).join(", ");

    link.innerHTML = `
        <div class="img-container">
            <span class="loader">Cargando...</span>
            <img src="${poke.sprites.front_default}" alt="${poke.name} image" class="poke-img hidden">
        </div>
        <p>${poke.name}</p>
        <p>Tipos: ${tipos}</p>
    `;

    const img = link.querySelector("img");
    const loader = link.querySelector(".loader");

    img.onload = () => {
        loader.classList.add("hidden");
        img.classList.remove("hidden");
    };

    img.onerror = () => {
        loader.textContent = "Error al cargar imagen";
    };

    GRID.appendChild(link);
}

// Ajusta el grid a 4 columnas siempre
function adjustGridLayout() {
    GRID.style.gridTemplateColumns = "repeat(4, 1fr)";
}

// Cargar los tipos disponibles
async function Cargar_tipos() {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data = await res.json();
        
        // Verifica si tienes datos
        console.log(data);
        
        data.results.forEach(tipo => {
            const option = document.createElement("option");
            option.value = tipo.name;
            option.textContent = tipo.name.charAt(0).toUpperCase() + tipo.name.slice(1);
            SELECT_TYPE.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando tipos de Pokémon:", error);
    }
}


// Botón para alternar modo oscuro
function modes() {
    const carcasa = document.querySelector(".pokedex_carcasa");
    carcasa.classList.toggle("dark-mode");
  
 const dark_body = document.querySelector("body");
    dark_body.classList.toggle("dark-mode");

    const gridDark = document.querySelector(".pokemonGrid");
    if (gridDark) gridDark.classList.toggle("dark-mode");

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => card.classList.toggle("dark-mode"));
}

// Buscar Pokémon individual
BUTTON.onclick = () => {
    const input = namepoke.value.trim();
    GRID.innerHTML = "";
    GRID.style.gridTemplateColumns = "repeat(1, 1fr)";
    GRID.classList.add("solo");

    if (input) {
        Mostrar_un_Pokemon(input);
    } else {
        const cantidad = SELECT_COUNT.value;
        const tipo = SELECT_TYPE.value;
        Lista_de_pokemon(cantidad, tipo, pagina_actual);
    }
};

// Mostrar un solo Pokémon
async function Mostrar_un_Pokemon(nombre) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        if (!res.ok) throw new Error("No se encontró el Pokémon");
        const poke = await res.json();
       // crearTarjetaPokemon(poke);
    } catch (error) {
        GRID.innerHTML = `<p style="grid-column: 1 / -1; color: red;">No se encontró el Pokémon "${nombre}"</p>`;
        console.error("Error buscando Pokémon:", error);
    }
}

// Cambio de tipo
SELECT_TYPE.addEventListener("change", () => {
    pagina_actual = 1;
    Lista_de_pokemon(SELECT_COUNT.value, SELECT_TYPE.value, pagina_actual);
});

// Cambio de cantidad
SELECT_COUNT.addEventListener("change", () => {
    pagina_actual = 1;
    Lista_de_pokemon(SELECT_COUNT.value, SELECT_TYPE.value, pagina_actual);
});

// Botón de modo oscuro
document.getElementById("darkModeButton").addEventListener("click", modes);

NEXT_BTN.addEventListener("click", () => {
    pagina_actual++;
    actualizarLista();
});

PREV_BTN.addEventListener("click", () => {
    if (pagina_actual > 1) {
        pagina_actual--;
        actualizarLista();
    }
});

// Función para actualizar la lista según la página actual y filtros
async function actualizarLista() {
    const cantidad = Number(SELECT_COUNT.value);
    const tipo = SELECT_TYPE.value;

    await Lista_de_pokemon(cantidad, tipo, pagina_actual);

    PAGE_INDICATOR.textContent = `Página ${pagina_actual}`;
    PREV_BTN.disabled = pagina_actual === 1;
    NEXT_BTN.disabled = (pagina_actual * cantidad) >= totalPokemon;
}



// Inicializar todo
window.onload = () => {
    actualizarLista(); // Para que se actualice el número de página también
    Cargar_tipos();
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

