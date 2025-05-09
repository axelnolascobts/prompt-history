const XHR = new XMLHttpRequest();

const POKEDEXINPUT = document.getElementById("pokemon");
const SEARCHBUTTON = document.getElementById("search-button");
const POKEMONNAME = document.getElementById("pokemon-name");
const POKEMONIMAGE = document.getElementById("pokemon-image");
const POKEMONTYPES = document.getElementById("pokemon-types");
const POKEMONID = document.getElementById("pokemon-id");
const POKEMONUL = document.getElementById("pokemon-list");


// SEARCHBUTTON.onclick = () => {

//     let inputValue = POKEDEXINPUT.value.toLocaleLowerCase();

//     XHR.open("GET", "https://pokeapi.co/api/v2/pokemon/"+inputValue, true);

//     XHR.onload = function () {

//         if (XHR.status === 200) {
    
//             console.log(XHR.responseText);
//             //console.log(typeof XHR.responseText);

//             const DATA = JSON.parse(XHR.responseText);

//             console.log(DATA.name);
//             POKEMONNAME.textContent = DATA.name;
            
//             console.log(DATA.sprites.front_default); //imagen
//             POKEMONIMAGE.src = ""+DATA.sprites.front_shiny;

//             console.log(DATA.id);
//             POKEMONID.textContent = DATA.id;

//             console.log(DATA.types);
//             let typesArray= [];
    
//             for (let i = 0; i < DATA.types.length; i++) {
//                 const TYPE = DATA.types[i];
    
//                 console.log(TYPE.type.name);
//                 typesArray.push(TYPE.type.name);
                
//             }

//             POKEMONTYPES.textContent = typesArray;
            
            
//         } else {

//             console.error("POKEMON NOT FOUND");
//             POKEMONNAME.textContent = "POKEMON NOT FOUND";
//             POKEMONIMAGE.src = "";
//             POKEMONID.textContent = "";
//             POKEMONTYPES.textContent = "";

//         }
//     }

//     XHR.onerror = function () {
//         console.error("POKEMON NOT FOUND");
//         POKEMONNAME.textContent = "POKEMON NOT FOUND";
//         POKEMONIMAGE.src = "";
//         POKEMONID.textContent = "";
//         POKEMONTYPES.textContent = "";
//     }
    
    
//     XHR.send();
    
//     //console.log(XHR.response);

// }


SEARCHBUTTON.onclick = () => {

    let inputValue = POKEDEXINPUT.value.toLocaleLowerCase();
    let auxiliarUrl = "https://pokeapi.co/api/v2/pokemon/"+inputValue;

    window.location.href="details.html?pokemonName="+inputValue;

    getPokemon(auxiliarUrl);

}

window.onload = () => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=20")
    .then ((response) => {
        if (!response.ok) {

            throw new Error("POKEMON NOT FOUND");

        }
        
        return response.json();
    })
    .then((data) => {

        let pokemon = data.results;
        //console.log(pokemon);
        
        for (let i = 0; i < pokemon.length; i++) {

            let auxiliarUrl = pokemon[i].url;

            const LI = document.createElement("div");
            LI.classList.add("pokemon-list-item");
            POKEMONUL.appendChild(LI);

            const NAMES = document.createElement("p");
            NAMES.classList.add("pokemon-names");
            LI.appendChild(NAMES);

            const SPRITE = document.createElement("img");
            SPRITE.classList.add("pokemon-sprite");
            LI.appendChild(SPRITE);

            const TYPES = document.createElement("p");
            TYPES.classList.add("pokemon-types");
            LI.appendChild(TYPES);

            //LI.textContent = pokemon[i].name;

            getPokemonList(auxiliarUrl, NAMES, SPRITE, TYPES);
            
        }

        const POKEMONLIST = document.getElementsByClassName("pokemon-list-item");
        const POKEMONNAMELIST = document.getElementsByClassName("pokemon-names");

        //console.log(POKEMONLIST);

        for (let i = 0; i < 20; i++) {
            
            POKEMONLIST[i].onclick = () => {
                    
                let pokemonName = POKEMONNAMELIST[i].textContent;
                //console.log(pokemonName);
                let auxiliarUrl = "https://pokeapi.co/api/v2/pokemon/"+pokemonName;

                //window.location.href="details.html?pokemonName="+pokemonName;

                getPokemon(auxiliarUrl);
            
            }
                
        }

    })

}

function getPokemon(url) {
    
    fetch(url)
    .then ((response) => {
        if (!response.ok) {

            throw new Error("POKEMON NOT FOUND");

        }
        //console.log(response);
        
        return response.json();
    })
    .then((data) => {
        //console.log(data);

        console.log(data.name);
        POKEMONNAME.textContent = data.name;
            
        console.log(data.sprites.front_default);
        POKEMONIMAGE.src = ""+data.sprites.front_default;

        //console.log(data.id);
        POKEMONID.textContent = data.id;

        //console.log(data.types);
        let typesArray= [];
    
        for (let i = 0; i < data.types.length; i++) {
            const TYPE = data.types[i];
    
            console.log(TYPE.type.name);
            typesArray.push(TYPE.type.name);
                
        }

        POKEMONTYPES.textContent = typesArray;
        
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });
}

function getPokemonList(url, NAMES, SPRITE, TYPES) {
    fetch(url)
    .then ((response) => {
        if (!response.ok) {

            throw new Error("POKEMON NOT FOUND");

        }
        //console.log(response);
        
        return response.json();
    })
    .then((data) => {

        let pokemonTypes = [];

        for (let i = 0; i < data.types.length; i++) {

            const TYPE = data.types[i];

            pokemonTypes.push(TYPE.type.name);
                
        }

        SPRITE.src = ""+data.sprites.front_default;
        TYPES.textContent = "Type(s): "+pokemonTypes;
        NAMES.textContent = data.name;
        
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });

}






