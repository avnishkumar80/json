/**
 * Custom hook for managing theme state
 */
import { useState, useEffect } from 'react';
import { STORAGE_KEYS, THEMES } from '../constants';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      setDarkMode(savedTheme === THEMES.DARK);
    } else {
      // Check if matchMedia is available (for test environment compatibility)
      try {
        const prefersDark = window.matchMedia 
          ? window.matchMedia('(prefers-color-scheme: dark)').matches 
          : false;
        setDarkMode(prefersDark);
      } catch (error) {
        // Fallback to false if matchMedia fails
        setDarkMode(false);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, darkMode ? THEMES.DARK : THEMES.LIGHT);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return { darkMode, toggleTheme };
};
