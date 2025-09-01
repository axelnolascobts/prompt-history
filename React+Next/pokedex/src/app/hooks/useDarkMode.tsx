import { useState } from 'react';

export const useDarkMode = () => {

  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {

    if (darkMode) {

      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    } else {
        
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }

    setDarkMode(!darkMode);
  };

  return { darkMode, toggleDarkMode };
};
