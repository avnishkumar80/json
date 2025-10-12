import React, { useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown, Copy, Check, Search, X, ChevronUp } from 'lucide-react';
import TreeNode from './TreeNode';
import { searchInTree, getParentPaths } from '../../utils/treeSearchUtils';

const TreeView = ({
  jsonInput,
  error,
  darkMode,
  copied,
  expandedNodes,
  onToggleNode,
  onExpandAll,
  onCollapseAll,
  onCopyToClipboard,
  // Search props
  showSearch,
  searchQuery,
  searchResults,
  currentSearchIndex,
  onSearchChange,
  onNavigateSearch,
  onClearSearch,
  onToggleSearch
}) => {
  // Parse JSON data
  let parsedData;
  try {
    if (!jsonInput.trim()) {
      parsedData = null;
    } else {
      parsedData = JSON.parse(jsonInput);
    }
  } catch (e) {
    parsedData = null;
  }

  // Perform tree-specific search
  const treeSearchResults = useMemo(() => {
    if (!searchQuery || !parsedData) return [];
    return searchInTree(parsedData, searchQuery);
  }, [searchQuery, parsedData]);

  // Auto-expand parent nodes of search results
  useEffect(() => {
    if (treeSearchResults.length > 0 && currentSearchIndex < treeSearchResults.length) {
      const currentResult = treeSearchResults[currentSearchIndex];
      const parentPaths = getParentPaths(currentResult.path);
      
      // Expand all parent nodes
      parentPaths.forEach(parentPath => {
        if (!expandedNodes.has(parentPath)) {
          onToggleNode(parentPath);
        }
      });
    }
  }, [currentSearchIndex, treeSearchResults]);

  // Handle search input change
  const handleSearchInput = (e) => {
    // Create a synthetic event for the parent handler
    onSearchChange(e, jsonInput);
  };

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (treeSearchResults.length > 0) {
        if (e.shiftKey) {
          onNavigateSearch('prev');
        } else {
          onNavigateSearch('next');
        }
      }
    } else if (e.key === 'Escape') {
      onToggleSearch();
    }
  };

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
      backgroundColor: darkMode ? '#111827' : '#ffffff'
    }}>
      {/* Tree Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onExpandAll}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ChevronDown size={14} />
            Expand All
          </button>
          
          <button
            onClick={onCollapseAll}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ChevronRight size={14} />
            Collapse All
          </button>

          {/* Search Toggle Button */}
          <button
            onClick={onToggleSearch}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: showSearch ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
              color: showSearch ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Toggle search"
          >
            <Search size={14} />
            Search
          </button>

          {/* Inline Search Bar */}
          {showSearch && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="text"
                  placeholder="Search keys & values... (Enter to navigate)"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchKeyDown}
                  style={{
                    width: '220px',
                    padding: '6px 12px',
                    border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#f3f4f6' : '#111827',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
              
              {treeSearchResults.length > 0 && (
                <>
                  <div style={{
                    fontSize: '13px',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    whiteSpace: 'nowrap'
                  }}>
                    {Math.min(currentSearchIndex + 1, treeSearchResults.length)}/{treeSearchResults.length}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => onNavigateSearch('prev')}
                      style={{
                        padding: '4px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                        color: darkMode ? '#d1d5db' : '#374151',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Previous result (Shift+Enter)"
                    >
                      <ChevronUp size={14} />
                    </button>
                    
                    <button
                      onClick={() => onNavigateSearch('next')}
                      style={{
                        padding: '4px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                        color: darkMode ? '#d1d5db' : '#374151',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Next result (Enter)"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </>
              )}
              
              <button
                onClick={onClearSearch}
                style={{
                  padding: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onCopyToClipboard}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: copied ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
            color: copied ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
            fontSize: '14px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Tree Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px 0'
      }}>
        {Array.isArray(parsedData) ? (
          parsedData.map((item, index) => (
            <TreeNode
              key={`[${index}]`}
              data={item}
              nodeKey={`[${index}]`}
              path={`[${index}]`}
              level={0}
              expandedNodes={expandedNodes}
              onToggleNode={onToggleNode}
              darkMode={darkMode}
              searchResults={treeSearchResults}
              currentSearchIndex={currentSearchIndex}
            />
          ))
        ) : (
          Object.entries(parsedData).map(([key, value]) => (
            <TreeNode
              key={key}
              data={value}
              nodeKey={key}
              path={key}
              level={0}
              expandedNodes={expandedNodes}
              onToggleNode={onToggleNode}
              darkMode={darkMode}
              searchResults={treeSearchResults}
              currentSearchIndex={currentSearchIndex}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TreeView;
