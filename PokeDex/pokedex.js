//const XHR = new XMLHttpRequest();
const POKEDEXINPUT = document.getElementById("pokemon");
const SEARCHBUTTON = document.getElementById("search-button");
const POKEMONNAME = document.getElementById("pokemon-name");
const POKEMONIMAGE = document.getElementById("pokemon-image");
const POKEMONTYPES = document.getElementById("pokemon-types");
const POKEMONID = document.getElementById("pokemon-id");
const POKEMONUL = document.getElementById("pokemon-list");
const TYPESELECTOR = document.getElementById("type-selector");
const PAGINATIONNUMBER = document.getElementById("pagination-selector");
const FILTERBUTTON = document.getElementById("filter-button");
const TOGGLE = document.getElementById('dark-mode-toggle');
const POKEDEXCONTAINER = document.getElementById("pokedex-container");
const POKEDEXSCREEN = document.getElementById("list-container");
const POKEMONSEARCH = document.getElementById("pokemon");
const BUTTONPREVIOUS = document.getElementById("button-previous");
const BUTTONNEXT = document.getElementById("button-next");
const LOADINGMESSAGE = document.getElementById("loading-message");
const SHOWCURRENTPAGE = document.getElementById("current-page");

let limit = parseInt(PAGINATIONNUMBER.value);
let offset = 0;
let totalPokemons = 1025;

TOGGLE.onchange = () => {

    if (TOGGLE.checked) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        POKEDEXCONTAINER.classList.remove('light-mode');
        POKEDEXCONTAINER.classList.add('dark-mode');
        POKEDEXSCREEN.classList.remove('light-mode');
        POKEDEXSCREEN.classList.add('dark-mode');
        POKEMONSEARCH.classList.remove('light-mode');
        POKEMONSEARCH.classList.add('dark-mode');
        
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        POKEDEXCONTAINER.classList.remove('dark-mode');
        POKEDEXCONTAINER.classList.add('light-mode');
        POKEDEXSCREEN.classList.remove('dark-mode');
        POKEDEXSCREEN.classList.add('light-mode');
        POKEMONSEARCH.classList.remove('dark-mode');
        POKEMONSEARCH.classList.add('light-mode');
    }

}


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
    let auxiliarUrl = `https://pokeapi.co/api/v2/pokemon/${inputValue}`;

    /*window.location.href=`details.html?searchValue=${inputValue}`;*/

    //createPokemonList(auxiliarUrl, NAMES, SPRITE, TYPES);
    POKEMONUL.innerHTML = "";
    getPokemon(auxiliarUrl);
    //toLoadPage(auxiliarUrl);

}



window.onload = () => {

    let consultPage = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    consultTypes();
    pageNumbers(totalPokemons, limit);
    toLoadPage(consultPage);

    /*fetch(consultPage)
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

            createPokemonList(auxiliarUrl, NAMES, SPRITE, TYPES); //cambiar nombre
            
        }

        const POKEMONLIST = document.getElementsByClassName("pokemon-list-item");
        const POKEMONNAMELIST = document.getElementsByClassName("pokemon-names");

        //console.log(POKEMONLIST);

        for (let i = 0; i < 20; i++) {
            
            POKEMONLIST[i].onclick = () => {
                    
                let pokemonName = POKEMONNAMELIST[i].textContent;
                //console.log(pokemonName);
                let auxiliarUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

                //window.location.href="details.html?pokemonName="+pokemonName;

                getPokemon(auxiliarUrl);
            
            }
                
        }

    })*/

}

async function toLoadPage(url) {

    LOADINGMESSAGE.style.display = "flex";

    try {

        const RESPONSE = await fetch(url);
        
        
        if (!RESPONSE.ok) {

            throw new Error("POKEMON NOT FOUND");

        }

        const DATA = await RESPONSE.json();

        let pokemon = DATA.results;
        
        
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

            createPokemonList(auxiliarUrl, NAMES, SPRITE, TYPES);
            
        }

        const POKEMONLIST = document.getElementsByClassName("pokemon-list-item");
        const POKEMONNAMELIST = document.getElementsByClassName("pokemon-names");

        for (let i = 0; i < pokemon.length; i++) {
            
            POKEMONLIST[i].onclick = () => {
                    
                let pokemonName = POKEMONNAMELIST[i].textContent;
                //let auxiliarUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

                window.location.href=`details.html?searchValue=${pokemonName}`;

                //getPokemon(auxiliarUrl);
            
            }
                
        }


    } catch (error) {

        POKEMONNAME.textContent = "POKEMON NOT FOUND";
        POKEMONIMAGE.src = ""
        POKEMONTYPES.textContent = "";
        POKEMONID.textContent = "";

    } finally {

        LOADINGMESSAGE.style.display = "none";
    }
    
}

async function getPokemon(url) {

    LOADINGMESSAGE.style.display = "flex";

    try {
        const RESPONSE = await fetch(url);
        //console.log(RESPONSE);
        

        if (!RESPONSE.ok) {

            throw new Error("POKEMON NOT FOUND");

        }

        const DATA = await RESPONSE.json();

        //console.log(DATA.name);
        //POKEMONNAME.textContent = DATA.name;
            
        //console.log(DATA.sprites.front_default);
        //POKEMONIMAGE.src = DATA.sprites.front_default;

        //console.log(data.id);
        //POKEMONID.textContent = DATA.id;

        //console.log(data.types);
        //let typesArray= [];
    
        //for (let types of DATA.types) {
    
            //console.log(TYPE.type.name);
            //typesArray.push(types.type.name);
                
        //}

        //POKEMONTYPES.textContent = typesArray;

        let auxiliarLimit = 1;
        let auxiliarOffset = DATA.id-1;
        let consultPage = `https://pokeapi.co/api/v2/pokemon/?limit=${auxiliarLimit}&offset=${auxiliarOffset}`;
        POKEMONUL.innerHTML = "";
        POKEMONUL.style.gridTemplateColumns = "repeat(1, 1fr)";
        toLoadPage(consultPage);
        

    } catch (error) {

        POKEMONNAME.textContent = "POKEMON NOT FOUND";
        POKEMONIMAGE.src = ""
        POKEMONTYPES.textContent = "";
        POKEMONID.textContent = "";
        
    } finally {

        LOADINGMESSAGE.style.display = "none";
    }
    
    /*fetch(url)
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
    });*/
}

async function createPokemonList(url, NAMES, SPRITE, TYPES) {

    LOADINGMESSAGE.style.display = "flex";

    try {

        const RESPONSE = await fetch(url);

        if (!RESPONSE.ok) {

            throw new Error("POKEMON NOT FOUND");

        }

        const DATA = await RESPONSE.json();

        let pokemonTypes = [];

        for (let types of DATA.types) {

            pokemonTypes.push(types.type.name);
                
        }

        SPRITE.src = DATA.sprites.front_default;
        TYPES.textContent = `Type(s): ${pokemonTypes}`;
        NAMES.textContent = DATA.name;

    } catch {

        POKEMONNAME.textContent = "POKEMON NOT FOUND";
        POKEMONIMAGE.src = ""
        POKEMONTYPES.textContent = "";
        POKEMONID.textContent = "";

    } finally {
        
        LOADINGMESSAGE.style.display = "none";
    }
    /*fetch(url)
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
        TYPES.textContent = `Type(s): ${pokemonTypes}`;
        NAMES.textContent = data.name;
        
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });*/

}

async function consultTypes() {

    try {

        let url = "https://pokeapi.co/api/v2/type";    

        const RESPONSE = await fetch(url);
    
        if (!RESPONSE.ok) {
    
            throw new Error("POKEMON NOT FOUND");
    
        }
    
        const DATA = await RESPONSE.json();
        let count = 1;

        for (let type of DATA.results) {

            if (count < 19){

                const TYPEOPTION = document.createElement("option");
                TYPEOPTION.classList.add("pokemon-type-option");
                TYPEOPTION.textContent = type.name;
                TYPEOPTION.value = count;           
                count++;

                TYPESELECTOR.appendChild(TYPEOPTION);

            }

        }
        
    } catch (error) {
        console.log("error");
        
    }
    
}

PAGINATIONNUMBER.onchange = () => {
    limit = parseInt(PAGINATIONNUMBER.value);
    offset = 0;
    pageNumbers(totalPokemons, limit);

    if (TYPESELECTOR.value === "") {

        paginationWithoutFilter();

    } else {

        paginationWithTypeFilter();

    }
    
}

FILTERBUTTON.onclick = () => {

    let filterValue = parseInt(TYPESELECTOR.value);

    if (isNaN(filterValue)) {

        offset = 0;
        totalPokemons = 1025;
        let consultPage = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
        POKEMONUL.innerHTML = "";
        POKEMONUL.style.gridTemplateColumns = "repeat(5, 1fr)";
        pageNumbers(totalPokemons, limit);
        toLoadPage(consultPage);

    } else {
        offset = 0;
    
        let consultPage = `https://pokeapi.co/api/v2/type/${filterValue}/`;

        getPokemonByType(consultPage);

    }
    
}

async function getPokemonByType(url) {
    //console.log(offset);
    
    try {
        const RESPONSE = await fetch(url);

        if (!RESPONSE.ok) {
            throw new Error("POKEMON NOT FOUND");
        }

        const DATA = await RESPONSE.json();

        console.log(DATA.pokemon);        
        
        let sum = 0;
        sum = parseInt(limit)+parseInt(offset);
        let firstPokemons = [];
        firstPokemons = DATA.pokemon.slice(offset, sum);
        console.log(sum);
        
        
        //console.log(firstPokemons);
        totalPokemons = DATA.pokemon.length;
        pageNumbers(totalPokemons, limit);

        renderPokemonList(firstPokemons);

    } catch (error) {
        POKEMONNAME.textContent = "POKEMON NOT FOUND";
        POKEMONIMAGE.src = "";
        POKEMONTYPES.textContent = "";
        POKEMONID.textContent = "";
    }
}

async function renderPokemonList(pokemonList) {
    POKEMONUL.innerHTML = "";
    POKEMONUL.style.gridTemplateColumns = "repeat(5, 1fr)";

    for (let i = 0; i < pokemonList.length; i++) {
        let url = pokemonList[i].pokemon.url;
        console.log(url);
        

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

        await createPokemonList(url, NAMES, SPRITE, TYPES);
    }

    const POKEMONLIST = document.getElementsByClassName("pokemon-list-item");
    const POKEMONNAMELIST = document.getElementsByClassName("pokemon-names");

    for (let i = 0; i < pokemonList.length; i++) {
        POKEMONLIST[i].onclick = () => {
            let pokemonName = POKEMONNAMELIST[i].textContent;
            window.location.href = `details.html?searchValue=${pokemonName}`;
        }
    }
}

const NUMPAGES = document.getElementById("pages");

async function pageNumbers(pokemonsNumber, pokemonLimit) {

    NUMPAGES.innerHTML = "";

    let pagesNumber = Math.ceil(pokemonsNumber/pokemonLimit);

     const PAGE = document.createElement("button");
     PAGE.classList.add("pagination-button");
     PAGE.textContent = pagesNumber;
     NUMPAGES.appendChild(PAGE);


    /*for (let i = 0; i < pagesNumber; i++) {

        if (i <= 2) {

            const PAGE = document.createElement("button");
            PAGE.classList.add("pagination-button");
            PAGE.classList.add("pagination-button-number");
            PAGE.textContent = i+1;

            NUMPAGES.appendChild(PAGE);

        } else if (i === 3) {

            const PAGE = document.createElement("button");
            PAGE.classList.add("pagination-button");
            PAGE.classList.add("pagination-button-number");
            PAGE.textContent = pagesNumber;

            NUMPAGES.appendChild(PAGE);

        }
        
    }

    const TOTALPAGES = document.getElementsByClassName("pagination-button-number");

        for (let i = 0; i < TOTALPAGES.length; i++) {
        TOTALPAGES[i].onclick = () => {
            let indexNumber = parseInt(TOTALPAGES[i].textContent);
            console.log(indexNumber);
            
            offset = (indexNumber-1)*limit;

            if (TYPESELECTOR.value === "") {

                paginationWithoutFilter();
                
            } else {

                paginationWithTypeFilter();
            }
        }
    }*/

}



BUTTONPREVIOUS.onclick = () => {
    

    if (offset > 0) {

        offset -= limit;

        if (TYPESELECTOR.value === "") {
            paginationWithoutFilter();
            
        } else {
            
            paginationWithTypeFilter();
        }

        let currentPage = Math.floor(offset / limit) + 1;
        console.log(currentPage);
        SHOWCURRENTPAGE.textContent = `Current page: ${currentPage}`;

    }
 
}

BUTTONNEXT.onclick = () => {

    
    if (offset + limit < totalPokemons) {

        if (offset <= totalPokemons) {
        offset += parseInt(limit);
        
        
            if (TYPESELECTOR.value === ""){
                paginationWithoutFilter();

            } else {

                paginationWithTypeFilter();

            }

        } else {
            offset = 0;
        }

        let currentPage = Math.floor(offset / limit) + 1;
        console.log(currentPage);
        SHOWCURRENTPAGE.textContent = `Current page: ${currentPage}`;

    }


}

async function paginationWithoutFilter() {

    let consultPage = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    POKEMONUL.innerHTML = "";
    POKEMONUL.style.gridTemplateColumns = "repeat(5, 1fr)";
    toLoadPage(consultPage);
    
}

async function paginationWithTypeFilter() {
    
    let filterValue = parseInt(TYPESELECTOR.value);
    POKEMONUL.innerHTML = "";
    POKEMONUL.style.gridTemplateColumns = "repeat(5, 1fr)";
    let consultPage = `https://pokeapi.co/api/v2/type/${filterValue}/`;
    getPokemonByType(consultPage);
    
}


