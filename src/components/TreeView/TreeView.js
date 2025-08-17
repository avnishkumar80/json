import React from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
import TreeNode from './TreeNode';

const TreeView = ({
  jsonInput,
  error,
  darkMode,
  copied,
  expandedNodes,
  onToggleNode,
  onExpandAll,
  onCollapseAll,
  onCopyToClipboard
}) => {
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

  let parsedData;
  try {
    parsedData = JSON.parse(jsonInput);
  } catch (e) {
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
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TreeView;
