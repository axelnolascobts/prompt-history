import React from "react";

interface Props {
  darkMode: boolean;
  toggle: () => void;
}

export default function DarkModeToggle({ darkMode, toggle }: Props) {
  return (
    <button onClick={toggle}>
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
