interface LimitSelectorProps {
  limit: number;
  handleLimitChange: (newLimit: number) => void;
  className?: string;
}

export default function LimitSelector({ limit, handleLimitChange, className }: LimitSelectorProps) {
  return (
    <select
      value={limit}
      onChange={(e) => handleLimitChange(Number(e.target.value))}
      className={className} 
    >
      {[5, 10, 20, 50, 100].map((num) => (
        <option key={num} value={num}>
          {num} Pokémon
        </option>
      ))}
    </select>
  );
}
