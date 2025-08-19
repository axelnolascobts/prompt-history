interface CellProps {
  value: 'X' | 'O' | null;        // Valor de la celda
  highlight: boolean;             // True si la celda está en la línea ganadora
  onClick: () => void;            // Función que maneja el click en la celda
}

function Cell({ value, onClick, highlight }: CellProps) {
  // X, O, null, funcion que maneja el click, boolean (highlight)
  
  let className = '';

  if (value === 'X') className += ' j1';   // Aplica estilo jugador 1
  if (value === 'O') className += ' j2';   // Aplica estilo jugador 2
  if (highlight) className += ' winner';   // Aplica estilo de celda ganadora

  return (
    // Retorna un div con la clase, el manejador de click y el valor (X, O, null)

    // onClick con `onClick={onClick}` 
    // es una función que se ejecuta al hacer clic y llama a la función pasada por props
    // Por qué no se usa `onClick={onClick()}`? Porque eso ejecutaría la función inmediatamente
    // en lugar de esperar al clic.
    // Por qué se usa `className`? Porque permite aplicar múltiples clases CSS
    // a un elemento, útil para estilos condicionales.
    <div className={`cell ${className}`} onClick={onClick}>
      {value}
    </div>
  );
}

export default Cell;
