import React, { useEffect, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import TreeNode from './TreeNode';
import { searchInTree, getParentPaths } from '../../utils/treeSearchUtils';

const TreeView = ({
  jsonInput,
  error,
  darkMode,
  copied,
  expandedNodes,
  onToggleNode,
  onCopyToClipboard,
  // Search props from header
  searchQuery,
  searchResults,
  currentSearchIndex,
  onSearchResultsUpdate
}) => {
  // Parse JSON data
  const parsedData = useMemo(() => {
    try {
      if (!jsonInput.trim()) {
        return null;
      } else {
        return JSON.parse(jsonInput);
      }
    } catch (e) {
      return null;
    }
  }, [jsonInput]);

  // Ensure root is always expanded
  useEffect(() => {
    if (parsedData && !expandedNodes.has('')) {
      onToggleNode('');
    }
  }, [parsedData, expandedNodes, onToggleNode]);

  // Perform tree-specific search
  const treeSearchResults = useMemo(() => {
    if (!searchQuery || !parsedData) return [];
    return searchInTree(parsedData, searchQuery);
  }, [searchQuery, parsedData]);

  // Create a map for O(1) lookup of search results by path
  const searchResultsMap = useMemo(() => {
    const map = new Map();
    treeSearchResults.forEach(result => {
      map.set(result.path, result);
    });
    return map;
  }, [treeSearchResults]);

  // Update parent with tree search results when they change
  useEffect(() => {
    if (onSearchResultsUpdate && searchQuery) {
      onSearchResultsUpdate(treeSearchResults);
    }
  }, [treeSearchResults, searchQuery, onSearchResultsUpdate]);

  // Auto-expand parent nodes of search results - without auto-scroll
  useEffect(() => {
    if (treeSearchResults.length > 0 && currentSearchIndex >= 0 && currentSearchIndex < treeSearchResults.length) {
      const currentResult = treeSearchResults[currentSearchIndex];
      if (currentResult && currentResult.path) {
        const parentPaths = getParentPaths(currentResult.path);

        // Expand all parent nodes of current result
        parentPaths.forEach(parentPath => {
          if (!expandedNodes.has(parentPath)) {
            onToggleNode(parentPath);
          }
        });
      }
    }
  }, [currentSearchIndex, treeSearchResults, expandedNodes, onToggleNode]);

  // Separate effect for scrolling - only on index change
  useEffect(() => {
    if (treeSearchResults.length > 0 && currentSearchIndex >= 0 && currentSearchIndex < treeSearchResults.length) {
      const currentResult = treeSearchResults[currentSearchIndex];
      if (currentResult && currentResult.path) {
        // Use requestAnimationFrame to ensure expansion has rendered
        const rafId = requestAnimationFrame(() => {
          setTimeout(() => {
            const element = document.querySelector(`[data-path="${currentResult.path}"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        });

        return () => cancelAnimationFrame(rafId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearchIndex]); // Only depend on currentSearchIndex to prevent constant scrolling

  if (error || !jsonInput.trim()) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: darkMode ? '#9ca3af' : '#6b7280',
        fontSize: '16px'
      }}>
        {error ? 'Fix JSON errors to view tree' : 'Enter valid JSON to see tree view'}
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: darkMode ? '#9ca3af' : '#6b7280',
        fontSize: '16px'
      }}>
        Invalid JSON format
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: darkMode ? '#111827' : '#ffffff',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      minHeight: 0,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Tree Content - Scrollable */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '12px',
        minHeight: 0
      }}>
        <TreeNode
          data={parsedData}
          nodeKey="root"
          path=""
          darkMode={darkMode}
          expandedNodes={expandedNodes}
          onToggleNode={onToggleNode}
          searchResults={treeSearchResults}
          searchResultsMap={searchResultsMap}
          currentSearchIndex={currentSearchIndex}
          searchQuery={searchQuery}
        />
      </div>

      {/* Floating Copy Button - Bottom Right */}
      <button
        onClick={onCopyToClipboard}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          padding: '10px 16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: copied ? '#10b981' : (darkMode ? '#374151' : '#ffffff'),
          color: copied ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: darkMode
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = darkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = darkMode
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
};

export default TreeView;