import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getValueColor } from '../../utils/treeUtils';

const TreeNode = ({ 
  data, 
  nodeKey, 
  path = '', 
  level = 0, 
  expandedNodes, 
  onToggleNode,
  darkMode,
  searchResults = [],
  currentSearchIndex = -1
}) => {
  const isExpanded = expandedNodes.has(path);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

  // Check if this node matches search
  const matchingResult = searchResults.find(result => result.path === path);
  const isCurrentMatch = matchingResult && searchResults[currentSearchIndex]?.path === path;
  const isMatch = !!matchingResult;

  const renderValue = (value) => {
    const color = getValueColor(value, darkMode);
    
    if (typeof value === 'string') {
      return <span style={{ color }}>{`"${value}"`}</span>;
    } else if (value === null) {
      return <span style={{ color }}>null</span>;
    } else {
      return <span style={{ color }}>{String(value)}</span>;
    }
  };

  // Highlight function for matching text
  const highlightText = (text, shouldHighlight) => {
    if (!shouldHighlight || !matchingResult) return text;
    
    const query = searchResults.length > 0 ? 
      (matchingResult.matchType === 'key' ? nodeKey : String(data)) : 
      '';
    
    if (!query) return text;

    return (
      <span style={{
        backgroundColor: isCurrentMatch ? '#fbbf24' : '#fef3c7',
        color: isCurrentMatch ? '#000' : 'inherit',
        padding: '2px 4px',
        borderRadius: '3px',
        fontWeight: isCurrentMatch ? '600' : '500'
      }}>
        {text}
      </span>
    );
  };

  return (
    <div key={path} style={{ userSelect: 'text' }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          paddingLeft: `${level * 24 + 12}px`,
          color: darkMode ? '#d1d5db' : '#374151',
          backgroundColor: isCurrentMatch ? 
            (darkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(254, 243, 199, 0.5)') : 
            (isMatch ? 
              (darkMode ? 'rgba(254, 243, 199, 0.1)' : 'rgba(254, 243, 199, 0.3)') : 
              'transparent')
        }}
        onMouseEnter={(e) => {
          if (!isCurrentMatch) {
            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(248, 250, 252, 0.8)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isCurrentMatch ? 
            (darkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(254, 243, 199, 0.5)') : 
            (isMatch ? 
              (darkMode ? 'rgba(254, 243, 199, 0.1)' : 'rgba(254, 243, 199, 0.3)') : 
              'transparent');
        }}
      >
        {isObject ? (
          <>
            <button
              onClick={() => onToggleNode(path)}
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
              color: darkMode ? '#f1f5f9' : '#1e293b' 
            }}>
              {isMatch && matchingResult.matchType === 'key' ? 
                highlightText(nodeKey, true) : 
                nodeKey}:
            </span>
            <span style={{ marginLeft: '8px', fontSize: '14px', color: darkMode ? '#6b7280' : '#6b7280' }}>
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
              color: darkMode ? '#f1f5f9' : '#1e293b' 
            }}>
              {isMatch && matchingResult.matchType === 'key' ? 
                highlightText(nodeKey, true) : 
                nodeKey}:
            </span>
            <span style={{ marginLeft: '8px' }}>
              {isMatch && matchingResult.matchType === 'value' ?
                <span style={{
                  backgroundColor: isCurrentMatch ? '#fbbf24' : '#fef3c7',
                  color: isCurrentMatch ? '#000' : getValueColor(data, darkMode),
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontWeight: isCurrentMatch ? '600' : '500'
                }}>
                  {typeof data === 'string' ? `"${data}"` : String(data)}
                </span> :
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
                searchResults={searchResults}
                currentSearchIndex={currentSearchIndex}
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
                searchResults={searchResults}
                currentSearchIndex={currentSearchIndex}
              />
            ))
          }
        </div>
      )}
    </div>
  );
};

export default TreeNode;
