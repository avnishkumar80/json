import { useEffect, useCallback } from 'react';

/**
 * Custom hook for managing keyboard shortcuts
 * Provides developer-friendly shortcuts for common JSON operations
 */
export const useKeyboardShortcuts = ({
  formatJson,
  minifyJson,
  toggleSearch,
  toggleTheme,
  clearInput,
  loadSample,
  toggleView,
  copyToClipboard,
  openSettings
}) => {
  
  const handleKeyDown = useCallback((e) => {
    // Don't handle shortcuts in search input
    if (e.target.classList.contains('search-input')) {
      return;
    }
    
    // Only handle shortcuts when not in input fields (except search)
    const isInputField = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
    const isJsonEditor = e.target.classList.contains('json-input') || 
                        e.target.classList.contains('json-textarea');
    
    // Allow shortcuts in JSON editor, but not in other input fields
    if (isInputField && !isJsonEditor) {
      return;
    }

    const modifier = e.ctrlKey || e.metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)
    
    if (modifier) {
      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          formatJson && formatJson();
          break;
          
        case 'm':
          e.preventDefault();
          minifyJson && minifyJson();
          break;
          
        case 'k': // Ctrl/Cmd + K for search
          e.preventDefault();
          toggleSearch && toggleSearch();
          break;
          
        case 'd': // Ctrl/Cmd + D for dark mode
          e.preventDefault();
          toggleTheme && toggleTheme();
          break;
          
        case 'u': // Ctrl/Cmd + U for clear
          e.preventDefault();
          clearInput && clearInput();
          break;
          
        case 'e': // Ctrl/Cmd + E for sample
          e.preventDefault();
          loadSample && loadSample();
          break;
          
        case 't': // Ctrl/Cmd + T for toggle view
          e.preventDefault();
          toggleView && toggleView();
          break;
          
        case 'c':
          if (e.shiftKey) { // Ctrl/Cmd + Shift + C for copy formatted
            e.preventDefault();
            copyToClipboard && copyToClipboard();
          }
          break;
          
        case ',': // Ctrl/Cmd + , for settings (common shortcut)
          e.preventDefault();
          openSettings && openSettings();
          break;
          
        default:
          break;
      }
    }
    
    // Non-modifier shortcuts
    if (!modifier && !e.shiftKey && !e.altKey) {
      switch (e.key) {
        case 'Escape':
          // Close search or settings
          if (toggleSearch) {
            toggleSearch(false); // Force close
          }
          break;
          
        default:
          break;
      }
    }
  }, [
    formatJson, minifyJson, toggleSearch, toggleTheme, clearInput,
    loadSample, toggleView, copyToClipboard, openSettings
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return shortcut information for display in help
  return {
    shortcuts: [
      { key: 'Ctrl/Cmd + F', action: 'Format JSON', description: 'Beautify and indent JSON' },
      { key: 'Ctrl/Cmd + M', action: 'Minify JSON', description: 'Remove whitespace and compress' },
      { key: 'Ctrl/Cmd + K', action: 'Toggle Search', description: 'Open/close search functionality' },
      { key: 'Ctrl/Cmd + D', action: 'Toggle Theme', description: 'Switch between dark and light mode' },
      { key: 'Ctrl/Cmd + U', action: 'Clear Input', description: 'Clear all JSON content' },
      { key: 'Ctrl/Cmd + E', action: 'Load Sample', description: 'Load example JSON data' },
      { key: 'Ctrl/Cmd + T', action: 'Toggle View', description: 'Switch between editor and tree view' },
      { key: 'Ctrl/Cmd + Shift + C', action: 'Copy Formatted', description: 'Copy formatted JSON to clipboard' },
      { key: 'Ctrl/Cmd + ,', action: 'Open Settings', description: 'Open settings modal' },
      { key: 'Escape', action: 'Close Modals', description: 'Close search or settings' }
    ]
  };
};

export default useKeyboardShortcuts;
