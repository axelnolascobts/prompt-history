const PARAMS = new URLSearchParams(window.location.search);
const POKEMONNAME = PARAMS.get("searchValue");
const POKEMONTITLE = document.getElementById("pokemon-big-name");
const POKEMONID = document.getElementById("pokemon-id");
const POKEMONHEIGHT = document.getElementById("pokemon-height");
const POKEMONWEIGHT = document.getElementById("pokemon-weight");
const POKEMONTYPES = document.getElementById("pokemon-types");
const BACKPAGE = document.getElementById("back-button");
const SPRITEGRID = document.getElementById("sprites-grid");

BACKPAGE.onclick = () => {
    window.location.href="pokedex.html";
}


window.onload = () => {

    let url = `https://pokeapi.co/api/v2/pokemon/${POKEMONNAME}`;

    findDetails(url);

    /*fetch(`https://pokeapi.co/api/v2/pokemon/${POKEMONNAME}`)
    .then ((response) => {
        if (!response.ok) {

            throw new Error("POKEMON NOT FOUND");
        }
        return response.json();
    })
    .then((data) => {
        
        POKEMONTITLE.textContent = `NAME: ${data.name}`;
        POKEMONID.textContent = `POKEDEX #: ${data.id}`;
        POKEMONHEIGHT.textContent = `HEIGHT: ${data.height} ft`;
        POKEMONWEIGHT.textContent = `WEIGHT: ${data.weight} ft`;

        console.log(data.sprites);
        
        for (let key in data.sprites) {

            if (typeof data.sprites[key] === "string") {
                const POKEMONIMAGES = document.createElement("img");
                POKEMONIMAGES.classList.add("pokemon-sprite");
                SPRITEGRID.appendChild(POKEMONIMAGES);

                POKEMONIMAGES.src = data.sprites[key];

                
                
            }
            
        }
        
        

        let types = "TYPE(S):";
    
        for (let i = 0; i < data.types.length; i++) {
            const TYPE = data.types[i];
            types += " "+TYPE.type.name+",";
                
        }
        
        POKEMONTYPES.textContent = types;
        
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });*/
}

async function findDetails(url) {

    try {
        const RESPONSE = await fetch(url);

        if (!RESPONSE.ok) {

            throw new Error("POKEMON NOT FOUND");
        }

        const DATA = await RESPONSE.json();

        POKEMONTITLE.textContent = `NAME: ${DATA.name}`;
        POKEMONID.textContent = `POKEDEX #: ${DATA.id}`;
        POKEMONHEIGHT.textContent = `HEIGHT: ${DATA.height} ft`;
        POKEMONWEIGHT.textContent = `WEIGHT: ${DATA.weight} cm`;
        
        for (let key in DATA.sprites) {

            if (typeof DATA.sprites[key] === "string") {
                const POKEMONIMAGES = document.createElement("img");
                POKEMONIMAGES.classList.add("pokemon-sprite");
                SPRITEGRID.appendChild(POKEMONIMAGES);

                POKEMONIMAGES.src = DATA.sprites[key];
                
            }
            
        }
        
        let types = "TYPE(S): ";
    
        for (let pokemonTypes of DATA.types) {

            types += `${pokemonTypes.type.name}`+" ";
                
        }
        
        POKEMONTYPES.textContent = types;

    } catch (error) {

        console.error(`Error: ${error}`);

        POKEMONTITLE.textContent = "POKEMON NOT FOUND";

    }
    
}
