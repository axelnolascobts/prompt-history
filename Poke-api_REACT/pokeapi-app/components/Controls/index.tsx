import React from "react";
import Search from "./Search";
import TypeFilter from "./TypeFilter";
import LimitSelector from "./LimitSelector";
import PaginationControls from "./PaginationControls";

interface ControlsProps {
  types: string[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  limit: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (term: string) => void;   
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPokemons: number;
  handleLimitChange: (newLimit: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  searchActive: boolean;                 
}


export default function Controls(props: ControlsProps) {
  return (
    <div className="flex flex-col gap-2">
    <Search
      searchTerm={props.searchTerm}
      setSearchTerm={props.setSearchTerm}
      handleSearch={props.handleSearch}
    />


      <div className="flex gap-2">
        <TypeFilter
          types={props.types}
          selectedType={props.selectedType}
          setSelectedType={props.setSelectedType}
          setCurrentPage={props.setCurrentPage}
        />
        <LimitSelector
          limit={props.limit}
          handleLimitChange={props.handleLimitChange}
        />
      </div>

      {/* Oculta paginación si estás en búsqueda */}
      {!props.searchActive && (
        <PaginationControls
          currentPage={props.currentPage}
          handlePrevPage={props.handlePrevPage}
          handleNextPage={props.handleNextPage}
          totalPokemons={props.totalPokemons}
          limit={props.limit}
        />
      )}
    </div>
  );
}
