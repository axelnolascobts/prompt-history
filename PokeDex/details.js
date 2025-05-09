const PARAMS = new URLSearchParams(window.location.search);
const POKEMONNAME = PARAMS.get("pokemonName");
const POKEMONTITLE = document.getElementById("pokemon-big-name");
const POKEMONID = document.getElementById("pokemon-id");
/*const POKEMONIMAGE1 = document.getElementById("image1");
const POKEMONIMAGE2 = document.getElementById("image2");
const POKEMONIMAGE3 = document.getElementById("image3");
const POKEMONIMAGE4 = document.getElementById("image4");*/
const POKEMONHEIGHT = document.getElementById("pokemon-height");
const POKEMONWEIGHT = document.getElementById("pokemon-weight");
const POKEMONTYPES = document.getElementById("pokemon-types");
const BACKPAGE = document.getElementById("back-button");
const SPRITEGRID = document.getElementById("sprites-grid");

BACKPAGE.onclick = () => {
    window.location.href="pokedex.html";
}


window.onload = () => {

    fetch("https://pokeapi.co/api/v2/pokemon/"+POKEMONNAME)
    .then ((response) => {
        if (!response.ok) {

            throw new Error("POKEMON NOT FOUND");
        }
        return response.json();
    })
    .then((data) => {
        
        POKEMONTITLE.textContent = "NAME: " + data.name;
        POKEMONID.textContent = "ID: " + data.id;
        // POKEMONIMAGE1.src=""+data.sprites.front_default;
        // POKEMONIMAGE2.src=""+data.sprites.back_default;
        // POKEMONIMAGE3.src=""+data.sprites.front_shiny;
        // POKEMONIMAGE4.src=""+data.sprites.back_shiny;
        POKEMONHEIGHT.textContent = "HEIGHT: "+data.height+" ft";
        POKEMONWEIGHT.textContent = "WEIGHT: "+data.weight+" ft";

        console.log(data.sprites);
        
        for (let key in data.sprites) {

            if (typeof data.sprites[key] === "string") {
                const POKEMONIMAGES = document.createElement("img");
                POKEMONIMAGES.classList.add("pokemon-sprite");
                SPRITEGRID.appendChild(POKEMONIMAGES);

                POKEMONIMAGES.src = ""+data.sprites[key];

                
                
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
    });
}
