/**
 * Application constants
 */

export const VIEW_MODES = {
  EDITOR: 'editor',
  TREE: 'tree'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const STORAGE_KEYS = {
  THEME: 'json-formatter-theme'
};

export const DEFAULT_SETTINGS = {
  INDENT_SIZE: 2,
  DARK_MODE: false
};

export const SAMPLE_JSON = {
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "A powerful JSON formatting and visualization tool",
  "features": [
    "Format JSON",
    "Minify JSON", 
    "Tree view",
    "Search functionality",
    "Dark mode",
    "File operations"
  ],
  "settings": {
    "darkMode": false,
    "indentSize": 2,
    "autoFormat": true
  },
  "metadata": {
    "created": "2024-01-01",
    "lastModified": new Date().toISOString(),
    "author": "JSON Formatter Team"
  }
};
