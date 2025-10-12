import React, { useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const JsonEditor = ({
  jsonInput,
  error,
  darkMode,
  copied,
  textareaRef,
  onInputChange,
  onCopyToClipboard,
  searchResults = [],
  currentSearchIndex = -1
}) => {
  // Scroll to current search result
  useEffect(() => {
    if (searchResults.length > 0 && currentSearchIndex >= 0 && textareaRef.current) {
      const result = searchResults[currentSearchIndex];
      if (result) {
        // Set selection to highlight the current match
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(result.start, result.end);
        
        // Calculate the line to scroll to
        const lines = jsonInput.substring(0, result.start).split('\n');
        const lineNumber = lines.length;
        const lineHeight = 22.4; // 14px font * 1.6 line-height
        const scrollTop = (lineNumber - 1) * lineHeight - 100; // Offset for better visibility
        
        textareaRef.current.scrollTop = Math.max(0, scrollTop);
      }
    }
  }, [currentSearchIndex, searchResults, jsonInput, textareaRef]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minHeight: '500px',
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
          flexShrink: 0
        }}>
          {error}
        </div>
      )}

      {/* Editor Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        minHeight: '400px',
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
            boxSizing: 'border-box',
            overflow: 'auto'
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
              fontWeight: '500',
              zIndex: 3
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
