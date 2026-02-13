import React from 'react';
import { AlertCircle, Lightbulb, X } from 'lucide-react';

const SimplifiedEditor = ({
  jsonInput,
  error,
  darkMode,
  useVscodeTheme,
  textareaRef,
  onInputChange,
  searchResults,
  currentSearchIndex,
  showAutoFix,
  autoFixSuggestions,
  onApplyFix,
  onApplyAllFixes,
  onDismissAutoFix
}) => {
  const useVscodeDark = darkMode && useVscodeTheme;
  const getHighlightedText = () => {
    if (!searchResults.length || !jsonInput) return jsonInput;
    
    let highlightedText = jsonInput;
    let offset = 0;
    
    searchResults.forEach((result, index) => {
      const isCurrentMatch = index === currentSearchIndex;
      const highlightColor = isCurrentMatch 
        ? 'rgba(251, 146, 60, 0.4)' 
        : 'rgba(250, 204, 21, 0.3)';
      
      const startTag = `<mark style="background-color: ${highlightColor}; padding: 2px 0; border-radius: 2px;">`;
      const endTag = '</mark>';
      
      const start = result.start + offset;
      const end = result.end + offset;
      
      highlightedText = 
        highlightedText.slice(0, start) + 
        startTag + 
        highlightedText.slice(start, end) + 
        endTag + 
        highlightedText.slice(end);
      
      offset += startTag.length + endTag.length;
    });
    
    return highlightedText;
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Auto-fix suggestions */}
      {showAutoFix && autoFixSuggestions.length > 0 && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: darkMode ? '#1e293b' : '#fef3c7',
          borderBottom: `1px solid ${darkMode ? '#475569' : '#fbbf24'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Lightbulb size={16} style={{ color: '#f59e0b' }} />
          <span style={{
            fontSize: '13px',
            color: darkMode ? '#fbbf24' : '#92400e'
          }}>
            {autoFixSuggestions.length} issue{autoFixSuggestions.length > 1 ? 's' : ''} found
          </span>
          <button
            onClick={onApplyAllFixes}
            style={{
              padding: '4px 12px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Fix All
          </button>
          {autoFixSuggestions.slice(0, 2).map((fix, idx) => (
            <button
              key={idx}
              onClick={() => onApplyFix(fix)}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                color: darkMode ? '#fbbf24' : '#92400e',
                border: `1px solid ${darkMode ? '#fbbf24' : '#f59e0b'}`,
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Fix: {fix.description}
            </button>
          ))}
          <button
            onClick={onDismissAutoFix}
            style={{
              marginLeft: 'auto',
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              color: darkMode ? '#94a3b8' : '#64748b',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        padding: '16px',
        overflow: 'auto'
      }}>
        {/* Line Numbers */}
        <div style={{
          paddingRight: '12px',
          borderRight: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          marginRight: '12px',
          userSelect: 'none',
          minWidth: '40px'
        }}>
          {jsonInput.split('\n').map((_, index) => (
            <div
              key={index}
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: useVscodeDark ? '#9da0a6' : (darkMode ? '#64748b' : '#94a3b8'),
                textAlign: 'right',
                fontFamily: useVscodeDark ? '"JetBrains Mono", "Fira Code", "Consolas", monospace' : 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={jsonInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste or type your JSON here..."
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            color: useVscodeDark ? '#d4d4d4' : (darkMode ? '#f1f5f9' : '#1e293b'),
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            lineHeight: '20px',
            fontFamily: useVscodeDark ? '"JetBrains Mono", "Fira Code", "Consolas", monospace' : 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            padding: 0
          }}
          spellCheck={false}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
          borderTop: `1px solid ${darkMode ? '#dc2626' : '#f87171'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
          <span style={{
            fontSize: '13px',
            color: darkMode ? '#fca5a5' : '#991b1b',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'
          }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default SimplifiedEditor;
