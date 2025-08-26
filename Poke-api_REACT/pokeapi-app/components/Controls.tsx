import React from "react";

// Props que recibe el componente Controls
interface ControlsProps {
  types: string[]; // Lista de tipos de Pokémon para el filtro
  selectedType: string; // Tipo seleccionado actualmente
  setSelectedType: (value: string) => void; // Función para actualizar el tipo seleccionado
  limit: number; // Cantidad de Pokémon por página
  searchTerm: string; // Texto de búsqueda
  setSearchTerm: (value: string) => void; // Función para actualizar la búsqueda
  currentPage: number; // Página actual
  setCurrentPage: (value: number) => void; // Función para cambiar la página
  totalPokemons: number; // Total de Pokémon disponibles
  handleLimitChange: (newLimit: number) => void; // Cambiar el límite de Pokémon por página
  handleNextPage: () => void; // Ir a la siguiente página
  handlePrevPage: () => void; // Ir a la página anterior
}

// Componente de controles: búsqueda, filtros y paginación
export default function Controls({
  types,
  selectedType,
  setSelectedType,
  limit,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPokemons,
  handleLimitChange,
  handleNextPage,
  handlePrevPage,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded"
      />

      {/* Selector de tipo */}
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value); // Actualiza el tipo
          setCurrentPage(1); // Reinicia la página al cambiar el filtro
        }}
        className="border p-2 rounded"
      >
        <option value="">All types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {/* Selector de límite de Pokémon por página */}
      <select
        value={limit}
        onChange={(e) => handleLimitChange(Number(e.target.value))}
        className="border p-2 rounded"
      >
        {[5, 10, 20, 50, 100].map((num) => (
          <option key={num} value={num}>
            {num} Pokémon
          </option>
        ))}
      </select>

      {/* Botones de paginación */}
      <div className="flex gap-2 items-center">
        <button
          onClick={handlePrevPage} // Ir a la página anterior
          disabled={currentPage === 1} // Deshabilitar si estamos en la primera página
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={handleNextPage} // Ir a la siguiente página
          disabled={currentPage * limit >= totalPokemons} // Deshabilitar si estamos al final
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
