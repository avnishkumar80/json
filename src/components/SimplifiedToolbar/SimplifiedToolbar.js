import React from 'react';
import { 
  FileText, 
  TreePine, 
  GitCompare,
  Zap,
  Minimize2,
  RotateCcw,
  Copy,
  FileCode,
  Settings2
} from 'lucide-react';

const SimplifiedToolbar = ({
  darkMode,
  viewMode,
  setViewMode,
  jsonInput,
  error,
  formatJson,
  minifyJson,
  clearInput,
  copyToClipboard,
  loadSample,
  copied,
  indentSize,
  setIndentSize
}) => {
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
    borderRadius: '6px',
    color: darkMode ? '#e2e8f0' : '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  };

  return (
    <div style={{
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      overflowX: 'auto',
      minHeight: '56px'
    }}>
      {/* View Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        backgroundColor: darkMode ? '#0f172a' : '#f1f5f9',
        borderRadius: '8px'
      }}>
        <button
          onClick={() => setViewMode('editor')}
          style={{
            padding: '6px 12px',
            backgroundColor: viewMode === 'editor' ? '#3b82f6' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            color: viewMode === 'editor' ? 'white' : darkMode ? '#94a3b8' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <FileText size={14} />
          Editor
        </button>
        <button
          onClick={() => setViewMode('tree')}
          disabled={!jsonInput || !!error}
          style={{
            padding: '6px 12px',
            backgroundColor: viewMode === 'tree' ? '#3b82f6' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            color: viewMode === 'tree' ? 'white' : darkMode ? '#94a3b8' : '#64748b',
            cursor: (!jsonInput || !!error) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s',
            opacity: (!jsonInput || !!error) ? 0.5 : 1
          }}
        >
          <TreePine size={14} />
          Tree
        </button>
        <button
          onClick={() => setViewMode('compare')}
          style={{
            padding: '6px 12px',
            backgroundColor: viewMode === 'compare' ? '#3b82f6' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            color: viewMode === 'compare' ? 'white' : darkMode ? '#94a3b8' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <GitCompare size={14} />
          Compare
        </button>
      </div>

      {/* Separator */}
      <div style={{
        width: '1px',
        height: '24px',
        backgroundColor: darkMode ? '#475569' : '#cbd5e1'
      }} />

      {/* Action Buttons */}
      <button
        onClick={formatJson}
        disabled={!jsonInput || !!error}
        style={{
          ...buttonStyle,
          backgroundColor: (!jsonInput || !!error) ? 'transparent' : '#10b981',
          borderColor: (!jsonInput || !!error) ? (darkMode ? '#475569' : '#cbd5e1') : '#10b981',
          color: (!jsonInput || !!error) ? (darkMode ? '#64748b' : '#94a3b8') : 'white',
          cursor: (!jsonInput || !!error) ? 'not-allowed' : 'pointer',
          opacity: (!jsonInput || !!error) ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (jsonInput && !error) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Zap size={14} />
        Format
      </button>

      <button
        onClick={minifyJson}
        disabled={!jsonInput || !!error}
        style={{
          ...buttonStyle,
          cursor: (!jsonInput || !!error) ? 'not-allowed' : 'pointer',
          opacity: (!jsonInput || !!error) ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (jsonInput && !error) {
            e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Minimize2 size={14} />
        Minify
      </button>

      <button
        onClick={copyToClipboard}
        disabled={!jsonInput}
        style={{
          ...buttonStyle,
          cursor: !jsonInput ? 'not-allowed' : 'pointer',
          opacity: !jsonInput ? 0.5 : 1,
          backgroundColor: copied ? '#10b981' : 'transparent',
          borderColor: copied ? '#10b981' : (darkMode ? '#475569' : '#cbd5e1'),
          color: copied ? 'white' : (darkMode ? '#e2e8f0' : '#475569')
        }}
      >
        <Copy size={14} />
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <button
        onClick={clearInput}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <RotateCcw size={14} />
        Clear
      </button>

      <button
        onClick={loadSample}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <FileCode size={14} />
        Sample
      </button>

      {/* Indent Size Control */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '12px',
          color: darkMode ? '#94a3b8' : '#64748b'
        }}>
          Indent:
        </span>
        <select
          value={indentSize}
          onChange={(e) => setIndentSize(Number(e.target.value))}
          style={{
            padding: '4px 8px',
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
            border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
            borderRadius: '4px',
            color: darkMode ? '#e2e8f0' : '#1e293b',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {[2, 3, 4, 6, 8].map(size => (
            <option key={size} value={size}>{size} spaces</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SimplifiedToolbar;