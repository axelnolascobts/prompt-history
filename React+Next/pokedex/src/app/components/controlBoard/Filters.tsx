import { Type } from "@/app/page";

interface FiltersProperties {

    paginationValue: number;
    changePokemonQuantity: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    types: Type[];
    changePokemonType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    pokemonType: number;
    typeFilter: () => void;
}


export const Filters: React.FC<FiltersProperties> = ({pokemonType, changePokemonType, types,
    paginationValue, changePokemonQuantity, typeFilter}) => {

  return(
    <>
        <form id="pokedex-settings" className="pokedex-settings">

            <select name="Type" id="type-selector" 
            required
            value={pokemonType}
            onChange={changePokemonType}>
                <option value="" disabled>Filter with type</option>
                <option value="">None</option>
                    {types.map((type, index) => (
                        <option key={index} value={index + 1} className="pokemon-type-option">
                            {type.name}
                        </option>
                    ))}
            </select>

            <select name="pagination" id="pagination-selector"
            required
            value={paginationValue}
            onChange={changePokemonQuantity}>

                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>

        </form>

        <section id="filter-button-container" className="button-container">
            <button id="filter-button" className="search-button"
            onClick={() => {typeFilter()}}></button>
        </section>
    </>
  );

}