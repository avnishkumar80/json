/**
 * Tree-specific search utilities
 */

/**
 * Search through JSON tree structure
 * Returns paths to matching nodes
 */
export const searchInTree = (data, query, path = '') => {
  if (!query.trim()) return [];
  
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  const searchNode = (node, currentPath, key) => {
    // Check if key matches
    const keyMatch = key && key.toLowerCase().includes(lowerQuery);
    
    // Check if value matches (for primitives)
    let valueMatch = false;
    if (node === null || typeof node !== 'object') {
      const valueStr = String(node).toLowerCase();
      valueMatch = valueStr.includes(lowerQuery);
    }
    
    // If this node matches, add it to results
    if (keyMatch || valueMatch) {
      results.push({
        path: currentPath,
        key: key,
        value: node,
        matchType: keyMatch ? 'key' : 'value'
      });
    }
    
    // Recursively search children
    if (node && typeof node === 'object') {
      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          const childPath = currentPath ? `${currentPath}.[${index}]` : `[${index}]`;
          searchNode(item, childPath, `[${index}]`);
        });
      } else {
        Object.entries(node).forEach(([childKey, childValue]) => {
          const childPath = currentPath ? `${currentPath}.${childKey}` : childKey;
          searchNode(childValue, childPath, childKey);
        });
      }
    }
  };
  
  // Start search from root
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      searchNode(item, `[${index}]`, `[${index}]`);
    });
  } else if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      searchNode(value, key, key);
    });
  }
  
  return results;
};

/**
 * Get all parent paths for a given path
 * Used to auto-expand parent nodes
 */
export const getParentPaths = (path) => {
  const parents = [];
  const parts = path.split('.');
  
  for (let i = 1; i < parts.length; i++) {
    parents.push(parts.slice(0, i).join('.'));
  }
  
  // Also handle array notation
  let current = '';
  const segments = path.match(/([^.\[]+|\[\d+\])/g) || [];
  
  for (let i = 0; i < segments.length - 1; i++) {
    if (current) {
      if (segments[i].startsWith('[')) {
        current += segments[i];
      } else {
        current += '.' + segments[i];
      }
    } else {
      current = segments[i];
    }
    if (!parents.includes(current)) {
      parents.push(current);
    }
  }
  
  return parents;
};

/**
 * Check if a path matches the search results
 */
export const isPathInSearchResults = (path, searchResults) => {
  return searchResults.some(result => result.path === path);
};
