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
  darkMode 
}) => {
  const isExpanded = expandedNodes.has(path);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

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
          color: darkMode ? '#d1d5db' : '#374151'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(248, 250, 252, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
            <span style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>
              {nodeKey}:
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
            <span style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>
              {nodeKey}:
            </span>
            <span style={{ marginLeft: '8px' }}>
              {renderValue(data)}
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
              />
            ))
          }
        </div>
      )}
    </div>
  );
};

export default TreeNode;
