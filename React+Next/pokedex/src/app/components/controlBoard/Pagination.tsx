interface PagintionProperties {

  buttonPrevious: () => void;
  buttonNext: () => void;
  numberOfPages: number;
  currentPage: number;
}


export const Pagination: React.FC<PagintionProperties> = ({buttonPrevious, buttonNext, numberOfPages, currentPage}) => {

  return(
    <>
      <section className="pagination-container">
            <button id="button-previous" className="pagination-button"
            onClick={buttonPrevious}> {`<-`} </button>
            <button className="pagination-button"> {numberOfPages} </button>
            <button id="button-next" className="pagination-button"
            onClick={buttonNext}> {`->`} </button>
        </section>

        <label>
            <p id="current-page" className="pokedex-text">Current page: {currentPage}</p>
        </label>
    </>
  );
}