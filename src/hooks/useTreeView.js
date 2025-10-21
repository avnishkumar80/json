/**
 * Custom hook for managing tree view state
 */
import { useState, useCallback } from 'react';
import { collectAllPaths } from '../utils/treeUtils';
import { validateJson } from '../utils/jsonUtils';

export const useTreeView = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const toggleNode = useCallback((path) => {
    setExpandedNodes(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  }, []);

  const expandAll = useCallback((jsonText) => {
    const validation = validateJson(jsonText);
    if (!validation.isValid) return;

    try {
      const parsed = JSON.parse(jsonText);
      const allPaths = collectAllPaths(parsed);
      setExpandedNodes(allPaths);
    } catch (e) {
      console.error('Error expanding all nodes:', e);
    }
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  return {
    expandedNodes,
    toggleNode,
    expandAll,
    collapseAll
  };
};
