/**
 * Tree view utilities
 */

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

export const getValueColor = (value, darkMode) => {
  if (value === null) return darkMode ? '#6b7280' : '#9ca3af';
  if (typeof value === 'string') return darkMode ? '#34d399' : '#059669';
  if (typeof value === 'number') return darkMode ? '#60a5fa' : '#2563eb';
  if (typeof value === 'boolean') return darkMode ? '#a78bfa' : '#7c3aed';
  if (Array.isArray(value)) return darkMode ? '#fb923c' : '#ea580c';
  if (typeof value === 'object') return darkMode ? '#fbbf24' : '#d97706';
  return darkMode ? '#d1d5db' : '#374151';
};
