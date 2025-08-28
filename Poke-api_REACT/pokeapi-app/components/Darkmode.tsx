import { useState } from "react";

export function useDarkMode(initial = false) {
  const [darkMode, setDarkMode] = useState(initial);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  return { darkMode, toggleDarkMode };
}
