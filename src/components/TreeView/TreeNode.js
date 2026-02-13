import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getValueColor } from '../../utils/treeUtils';
import { vscodeDark, vscodeTokens } from '../../utils/vscodeTheme';

const TreeNode = ({
  data,
  nodeKey,
  path = '',
  level = 0,
  expandedNodes,
  onToggleNode,
  darkMode,
  useVscodeTheme,
  searchResults = [],
  searchResultsMap,
  currentSearchIndex = -1,
  searchQuery = '',
  selectedPath,
  onSelectPath
}) => {
  const useVscodeDark = darkMode && useVscodeTheme;
  const isExpanded = expandedNodes.has(path);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

  // Check if this node matches search
  const matchingResult = searchResultsMap ? searchResultsMap.get(path) : null;
  const isMatch = !!matchingResult;
  const isCurrentMatch = currentSearchIndex >= 0 && searchResults[currentSearchIndex]?.path === path;

  const renderValue = (value) => {
    const color = getValueColor(value, darkMode, useVscodeTheme);

    if (typeof value === 'string') {
      return <span style={{ color }}>{`"${value}"`}</span>;
    } else if (value === null) {
      return <span style={{ color }}>null</span>;
    } else {
      return <span style={{ color }}>{String(value)}</span>;
    }
  };

  // Highlight function for matching text
  // Highlight function for matching text
  const highlightText = (text) => {
    if (!matchingResult || !searchQuery) return text;

    const stringText = String(text);
    const lowerText = stringText.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();

    if (!lowerText.includes(lowerQuery)) return text;

    const parts = [];
    let lastIndex = 0;
    let index = lowerText.indexOf(lowerQuery);

    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        parts.push(stringText.substring(lastIndex, index));
      }

      // Add match
      const matchText = stringText.substring(index, index + lowerQuery.length);
      parts.push(
        <span key={index} style={{
          backgroundColor: useVscodeDark ? (isCurrentMatch ? 'rgba(215, 186, 125, 0.55)' : 'rgba(215, 186, 125, 0.35)') : (isCurrentMatch ? '#f59e0b' : '#fbbf24'),
          color: useVscodeDark ? vscodeDark.text : '#000',
          padding: '0 2px',
          borderRadius: '2px',
          fontWeight: isCurrentMatch ? '700' : '600'
        }}>
          {matchText}
        </span>
      );

      lastIndex = index + lowerQuery.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }

    // Add remaining text
    if (lastIndex < stringText.length) {
      parts.push(stringText.substring(lastIndex));
    }

    return <span>{parts}</span>;
  };

  const isSelected = selectedPath === path;

  return (
    <div key={path} style={{ userSelect: 'text' }}>
      <div
        data-path={path}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          paddingLeft: `${level * 24 + 12}px`,
          color: useVscodeDark ? vscodeDark.text : (darkMode ? '#d1d5db' : '#374151'),
          outline: isSelected ? `1px solid ${useVscodeDark ? vscodeDark.accent : (darkMode ? '#60a5fa' : '#2563eb')}` : 'none',
          boxShadow: isSelected ? (useVscodeDark ? '0 0 0 2px rgba(0,122,204,0.35)' : (darkMode ? '0 0 0 2px rgba(59,130,246,0.35)' : '0 0 0 2px rgba(37,99,235,0.2)')) : 'none',
          backgroundColor: isCurrentMatch
            ? (useVscodeDark ? 'rgba(215, 186, 125, 0.2)' : (darkMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)'))
            : isMatch
              ? (useVscodeDark ? 'rgba(215, 186, 125, 0.12)' : (darkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(254, 243, 199, 0.4)'))
              : 'transparent'
        }}
        onClick={() => {
          if (onSelectPath && isObject) onSelectPath(path);
        }}
        onMouseEnter={(e) => {
          if (!isCurrentMatch && !isMatch) {
            e.currentTarget.style.backgroundColor = useVscodeDark ? vscodeDark.hover : (darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(248, 250, 252, 0.8)');
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isCurrentMatch
            ? (useVscodeDark ? 'rgba(215, 186, 125, 0.2)' : (darkMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)'))
            : isMatch
              ? (useVscodeDark ? 'rgba(215, 186, 125, 0.12)' : (darkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(254, 243, 199, 0.4)'))
              : 'transparent';
        }}
      >
        {isObject ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleNode(path);
              }}
              style={{
                marginRight: '8px',
                padding: '2px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: 'inherit'
              }}
            >
              {isExpanded ?
                <ChevronDown size={16} /> :
                <ChevronRight size={16} />
              }
            </button>
            <span style={{
              fontWeight: '500',
              color: useVscodeDark ? vscodeTokens.key : (darkMode ? '#f1f5f9' : '#1e293b')
            }}>
              {isMatch && matchingResult.matchType === 'key' ?
                highlightText(nodeKey) :
                nodeKey}:
            </span>
            <span style={{ marginLeft: '8px', fontSize: '14px', color: useVscodeDark ? vscodeDark.muted : '#6b7280' }}>
              {isArray ?
                `Array(${data.length})` :
                `Object(${Object.keys(data).length})`
              }
            </span>
          </>
        ) : (
          <>
            <div style={{ width: '20px', marginRight: '8px' }}></div>
            <span style={{
              fontWeight: '500',
              color: useVscodeDark ? vscodeTokens.key : (darkMode ? '#f1f5f9' : '#1e293b')
            }}>
              {isMatch && matchingResult.matchType === 'key' ?
                highlightText(nodeKey) :
                nodeKey}:
            </span>
            <span style={{ marginLeft: '8px' }}>
              {isMatch && matchingResult.matchType === 'value' ?
                highlightText(typeof data === 'string' ? `"${data}"` : data) :
                renderValue(data)
              }
            </span>
          </>
        )}
      </div>

      {isObject && isExpanded && (
        <div>
          {isArray ?
            data.map((item, index) => (
              <TreeNode
                key={`${path}.[${index}]`}
                data={item}
                nodeKey={`[${index}]`}
                path={path ? `${path}.[${index}]` : `[${index}]`}
                level={level + 1}
                expandedNodes={expandedNodes}
                onToggleNode={onToggleNode}
                darkMode={darkMode}
                useVscodeTheme={useVscodeTheme}
                searchResults={searchResults}
                searchResultsMap={searchResultsMap}
                currentSearchIndex={currentSearchIndex}
                searchQuery={searchQuery}
                selectedPath={selectedPath}
                onSelectPath={onSelectPath}
              />
            )) :
            Object.entries(data).map(([childKey, childValue]) => (
              <TreeNode
                key={`${path}.${childKey}`}
                data={childValue}
                nodeKey={childKey}
                path={path ? `${path}.${childKey}` : childKey}
                level={level + 1}
                expandedNodes={expandedNodes}
                onToggleNode={onToggleNode}
                darkMode={darkMode}
                useVscodeTheme={useVscodeTheme}
                searchResults={searchResults}
                searchResultsMap={searchResultsMap}
                currentSearchIndex={currentSearchIndex}
                searchQuery={searchQuery}
                selectedPath={selectedPath}
                onSelectPath={onSelectPath}
              />
            ))
          }
        </div>
      )}
    </div>
  );
};

export default TreeNode;
