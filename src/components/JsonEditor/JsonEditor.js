import React, { useEffect, useRef } from 'react';
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
  currentSearchIndex = -1,
  onCursorChange
}) => {
  const highlightLayerRef = useRef(null);

  // Scroll to current search result and update highlights
  useEffect(() => {
    if (searchResults.length > 0 && currentSearchIndex >= 0 && textareaRef.current) {
      const result = searchResults[currentSearchIndex];
      if (result) {
        // Calculate the line to scroll to
        const lines = jsonInput.substring(0, result.start).split('\n');
        const lineNumber = lines.length;
        const lineHeight = 22.4; // 14px font * 1.6 line-height
        const scrollTop = (lineNumber - 1) * lineHeight - 100; // Offset for better visibility

        textareaRef.current.scrollTop = Math.max(0, scrollTop);

        // Scroll highlight layer to match
        if (highlightLayerRef.current) {
          highlightLayerRef.current.scrollTop = textareaRef.current.scrollTop;
        }
      }
    }
  }, [currentSearchIndex, searchResults, jsonInput, textareaRef]);

  // Sync scroll between textarea and highlight layer
  const handleScroll = (e) => {
    if (highlightLayerRef.current) {
      highlightLayerRef.current.scrollTop = e.target.scrollTop;
      highlightLayerRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Handle cursor position updates
  const handleCursorUpdate = (e) => {
    if (!onCursorChange) return;

    const textarea = e.target;
    const selectionStart = textarea.selectionStart;
    const value = textarea.value;

    const lines = value.substring(0, selectionStart).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;

    onCursorChange({ line, col });
  };

  // Create highlighted content
  const createHighlightedContent = () => {
    if (searchResults.length === 0 || !jsonInput) {
      return jsonInput;
    }

    let highlighted = '';
    let lastIndex = 0;

    searchResults.forEach((result, index) => {
      // Add text before this match
      highlighted += escapeHtml(jsonInput.substring(lastIndex, result.start));

      // Add highlighted match
      const matchText = escapeHtml(jsonInput.substring(result.start, result.end));
      const isActive = index === currentSearchIndex;
      highlighted += `<mark class="${isActive ? 'search-highlight-active' : 'search-highlight'}">${matchText}</mark>`;

      lastIndex = result.end;
    });

    // Add remaining text
    highlighted += escapeHtml(jsonInput.substring(lastIndex));

    return highlighted;
  };

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minHeight: 0,
      height: '100%',
      backgroundColor: darkMode ? '#111827' : '#ffffff',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
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
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Highlight Layer */}
        {searchResults.length > 0 && (
          <div
            ref={highlightLayerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: '20px',
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              color: 'transparent',
              pointerEvents: 'none',
              overflow: 'auto',
              zIndex: 1
            }}
            dangerouslySetInnerHTML={{ __html: createHighlightedContent() }}
          />
        )}

        <textarea
          ref={textareaRef}
          value={jsonInput}
          onChange={(e) => {
            onInputChange(e);
            handleCursorUpdate(e);
          }}
          onScroll={handleScroll}
          onSelect={handleCursorUpdate}
          onClick={handleCursorUpdate}
          onKeyUp={handleCursorUpdate}
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
            overflow: 'auto',
            position: 'relative',
            zIndex: 2
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
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: copied ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
              color: copied ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              zIndex: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
