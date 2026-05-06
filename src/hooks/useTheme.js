/**
 * Custom hook for managing theme state
 */
import { useState, useEffect } from 'react';
import { STORAGE_KEYS, THEMES } from '../constants';

export const useTheme = () => {
  // Lazy initializer reads localStorage synchronously so the very first render
  // already has the correct theme — prevents the light-flash on page navigation.
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      return savedTheme === THEMES.DARK;
    }
    try {
      return window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, darkMode ? THEMES.DARK : THEMES.LIGHT);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return { darkMode, toggleTheme };
};
