import React from 'react';
import { Copy, Check } from 'lucide-react';

const JsonEditor = ({
  jsonInput,
  error,
  darkMode,
  copied,
  textareaRef,
  onInputChange,
  onCopyToClipboard
}) => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minHeight: '500px', // Ensure minimum height
      height: '100%'
    }}>
      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2',
          color: darkMode ? '#fca5a5' : '#dc2626',
          padding: '12px 16px',
          fontSize: '14px',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          flexShrink: 0 // Don't shrink the error bar
        }}>
          {error}
        </div>
      )}

      {/* Editor Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        minHeight: '400px', // Reduced slightly but still substantial
        height: '100%'
      }}>
        <textarea
          ref={textareaRef}
          value={jsonInput}
          onChange={onInputChange}
          placeholder="Paste your JSON here..."
          style={{
            width: '100%',
            height: '100%',
            padding: '20px',
            border: 'none',
            resize: 'none',
            outline: 'none',
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            fontSize: '14px',
            lineHeight: '1.6',
            backgroundColor: 'transparent',
            color: darkMode ? '#f3f4f6' : '#111827',
            tabSize: 2,
            boxSizing: 'border-box', // Include padding in height calculation
            overflow: 'auto' // Allow scrolling within textarea
          }}
          spellCheck={false}
        />

        {/* Copy Button */}
        {jsonInput.trim() && (
          <button
            onClick={onCopyToClipboard}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: copied ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
              color: copied ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
