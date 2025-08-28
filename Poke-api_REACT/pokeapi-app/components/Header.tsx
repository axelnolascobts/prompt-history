"use client";
import React from "react";
import Search from "./Controls/Search";
import TypeFilter from "./Controls/TypeFilter";
import LimitSelector from "./Controls/LimitSelector";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (term: string) => void;
  types: string[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  limit: number;
  handleLimitChange: (newLimit: number) => void;
  setCurrentPage: (value: number) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  handleSearch,
  types,
  selectedType,
  setSelectedType,
  limit,
  handleLimitChange,
  setCurrentPage,
  darkMode,
  toggleDarkMode
}: HeaderProps) {
  
  const selectClass = `border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`;
  const buttonClass = `px-2 py-1 rounded ${darkMode ? "bg-green-600 text-white" : "bg-green-400"}`;

  return (
    <div className="centered">
      
      {/* Grupo búsqueda */}
      
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          
        />
    

      {/* Grupo selectores + dark mode */}
    
        <TypeFilter
          types={types}
          selectedType={selectedType}
          setSelectedType={(val) => {
            setSelectedType(val);
            setCurrentPage(1);
          }}
          setCurrentPage={setCurrentPage}
          className={selectClass}
        />

        <LimitSelector
          limit={limit}
          handleLimitChange={handleLimitChange}
          className={selectClass}
        />

        <button onClick={toggleDarkMode} className={buttonClass}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
  
  );
}
