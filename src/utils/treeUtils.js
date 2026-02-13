/**
 * Tree view utilities
 */

import { vscodeTokens } from './vscodeTheme';

export const collectAllPaths = (obj, currentPath = '') => {
  const paths = new Set();
  
  const traverse = (data, path) => {
    if (typeof data === 'object' && data !== null) {
      paths.add(path);
      
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          const newPath = path ? `${path}.[${index}]` : `[${index}]`;
          traverse(item, newPath);
        });
      } else {
        Object.entries(data).forEach(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key;
          traverse(value, newPath);
        });
      }
    }
  };
  
  traverse(obj, currentPath);
  return paths;
};

export const getValueColor = (value, darkMode, useVscodeTheme) => {
  if (!darkMode) {
    if (value === null) return '#9ca3af';
    if (typeof value === 'string') return '#059669';
    if (typeof value === 'number') return '#2563eb';
    if (typeof value === 'boolean') return '#7c3aed';
    if (Array.isArray(value)) return '#ea580c';
    if (typeof value === 'object') return '#d97706';
    return '#374151';
  }

  if (!useVscodeTheme) {
    if (value === null) return '#6b7280';
    if (typeof value === 'string') return '#34d399';
    if (typeof value === 'number') return '#60a5fa';
    if (typeof value === 'boolean') return '#a78bfa';
    if (Array.isArray(value)) return '#fb923c';
    if (typeof value === 'object') return '#fbbf24';
    return '#d1d5db';
  }

  if (value === null) return vscodeTokens.null;
  if (typeof value === 'string') return vscodeTokens.string;
  if (typeof value === 'number') return vscodeTokens.number;
  if (typeof value === 'boolean') return vscodeTokens.boolean;
  if (Array.isArray(value)) return vscodeTokens.array;
  if (typeof value === 'object') return vscodeTokens.object;
  return vscodeTokens.object;
};
