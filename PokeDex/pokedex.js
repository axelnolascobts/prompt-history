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

    fetch("https://pokeapi.co/api/v2/pokemon/"+inputValue)
    .then ((response) => {
        if (!response.ok) {

            throw new Error("POKEMON NOT FOUND");

        }
        console.log(response);
        
        return response.json();
    })
    .then((data) => {
        console.log(data);

        console.log(data.name);
        POKEMONNAME.textContent = data.name;
            
        console.log(data.sprites.front_default);
        POKEMONIMAGE.src = ""+data.sprites.front_default;

        console.log(data.id);
        POKEMONID.textContent = data.id;

        console.log(data.types);
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

            const LI = document.createElement("li");
            //console.log(pokemon[i].name);
            
            LI.classList.add("pokemon-list-item");
            LI.textContent = pokemon[i].name;
            POKEMONUL.appendChild(LI);
            
        }

        const POKEMONLIST = document.getElementsByClassName("pokemon-list-item");

        console.log(POKEMONLIST);

        for (let i = 0; i < 20; i++) {
            
            POKEMONLIST[i].onclick = () => {
                    
                let pokemonName = POKEMONLIST[i].textContent;
                console.log(pokemonName);

                fetch("https://pokeapi.co/api/v2/pokemon/"+pokemonName)
                    .then ((response) => {
                        if (!response.ok) {

                            throw new Error("POKEMON NOT FOUND");

                        }
                        console.log(response);
                        
                        return response.json();
                    })
                    .then((data) => {
                        console.log(data);

                        console.log(data.name);
                        POKEMONNAME.textContent = data.name;
                            
                        console.log(data.sprites.front_default);
                        POKEMONIMAGE.src = ""+data.sprites.front_default;

                        console.log(data.id);
                        POKEMONID.textContent = data.id;

                        console.log(data.types);
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
                
        }

    })

}

// //const POKEMONLIST = document.getElementsByClassName("pokemon-list-item");

// //console.log(POKEMONLIST);



// for (let i = 0; i < 20; i++) {

//     console.log("aaaa");
        
    
//     POKEMONLIST[i].onclick = () => {
            
//         let pokemonName = POKEMONLIST[i].textContent;
//         console.log(pokemonName);
            
    
//     }
        
// }






