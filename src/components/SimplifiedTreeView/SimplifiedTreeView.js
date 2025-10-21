import React, { useMemo } from 'react';
import { ChevronRight, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { validateJson } from '../../utils/jsonUtils';

const SimplifiedTreeView = ({
  jsonInput,
  error,
  darkMode,
  expandedNodes,
  onToggleNode,
  onExpandAll,
  onCollapseAll,
  searchQuery,
  searchResults,
  currentSearchIndex
}) => {
  const parsedJson = useMemo(() => {
    if (!jsonInput || error) return null;
    const validation = validateJson(jsonInput);
    if (!validation.isValid) return null;
    try {
      return JSON.parse(jsonInput);
    } catch {
      return null;
    }
  }, [jsonInput, error]);

  const renderValue = (value, path = '') => {
    if (value === null) return <span style={{ color: '#ef4444' }}>null</span>;
    if (value === undefined) return <span style={{ color: '#ef4444' }}>undefined</span>;
    if (typeof value === 'boolean') return <span style={{ color: '#3b82f6' }}>{String(value)}</span>;
    if (typeof value === 'number') return <span style={{ color: '#10b981' }}>{value}</span>;
    if (typeof value === 'string') return <span style={{ color: '#f59e0b' }}>"{value}"</span>;
    
    if (Array.isArray(value)) {
      const isExpanded = expandedNodes[path];
      return (
        <div>
          <span 
            onClick={() => onToggleNode(path)}
            style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span style={{ color: darkMode ? '#94a3b8' : '#64748b', marginLeft: '4px' }}>
              Array[{value.length}]
            </span>
          </span>
          {isExpanded && (
            <div style={{ marginLeft: '20px', marginTop: '4px' }}>
              {value.map((item, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>
                  <span style={{ color: darkMode ? '#64748b' : '#94a3b8', marginRight: '8px' }}>
                    {index}:
                  </span>
                  {renderValue(item, `${path}.${index}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      const isExpanded = expandedNodes[path];
      const keys = Object.keys(value);
      return (
        <div>
          <span 
            onClick={() => onToggleNode(path)}
            style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span style={{ color: darkMode ? '#94a3b8' : '#64748b', marginLeft: '4px' }}>
              Object{keys.length > 0 ? ` {${keys.length}}` : ''}
            </span>
          </span>
          {isExpanded && (
            <div style={{ marginLeft: '20px', marginTop: '4px' }}>
              {keys.map((key) => (
                <div key={key} style={{ marginBottom: '2px' }}>
                  <span style={{ color: '#a78bfa', marginRight: '8px' }}>
                    "{key}":
                  </span>
                  {renderValue(value[key], `${path}.${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  if (error) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: darkMode ? '#f87171' : '#dc2626'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>Invalid JSON</p>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!parsedJson) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: darkMode ? '#64748b' : '#94a3b8'
      }}>
        <p>Enter valid JSON to see the tree view</p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Tree Actions Bar */}
      <div style={{
        padding: '8px 16px',
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc'
      }}>
        <button
          onClick={onExpandAll}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
            borderRadius: '4px',
            color: darkMode ? '#e2e8f0' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Maximize2 size={12} />
          Expand All
        </button>
        <button
          onClick={onCollapseAll}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
            borderRadius: '4px',
            color: darkMode ? '#e2e8f0' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Minimize2 size={12} />
          Collapse All
        </button>
        {searchQuery && searchResults.length > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '12px',
            color: darkMode ? '#94a3b8' : '#64748b'
          }}>
            {searchResults.length} matches found
          </span>
        )}
      </div>

      {/* Tree Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
        fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: '13px',
        lineHeight: '1.6'
      }}>
        {renderValue(parsedJson, 'root')}
      </div>
    </div>
  );
};

export default SimplifiedTreeView;