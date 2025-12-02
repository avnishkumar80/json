import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';

const JsonEditor = ({
  jsonInput,
  error,
  darkMode,
  copied,
  textareaRef, // This ref will now point to nothing or we can try to expose something similar if needed, but for now it's likely unused by parent in a way that breaks things immediately except for focus
  onInputChange,
  onCopyToClipboard,
  searchResults = [],
  currentSearchIndex = -1,
  onCursorChange
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsCollectionRef = useRef(null);

  // Handle Editor Mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Create a decorations collection
    decorationsCollectionRef.current = editor.createDecorationsCollection([]);

    // Listen for cursor changes
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          line: e.position.lineNumber,
          col: e.position.column
        });
      }
    });

    // Initial focus if needed, or expose focus method
    if (textareaRef) {
      // If the parent expects a ref with a focus method, we can try to attach it
      // but usually textareaRef is a direct DOM ref. 
      // For now, we'll just ignore it or maybe set it to a proxy object if strictly required.
    }
  };

  // Handle Input Change
  const handleEditorChange = (value) => {
    // Monaco returns undefined when empty
    const newValue = value || '';
    // Create a synthetic event to match the previous interface expected by App.js
    const syntheticEvent = {
      target: {
        value: newValue
      }
    };
    onInputChange(syntheticEvent);
  };

  // Handle Search Highlighting and Navigation
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco || !decorationsCollectionRef.current) return;

    const model = editor.getModel();
    if (!model) return;

    const newDecorations = [];

    if (searchResults.length > 0) {
      searchResults.forEach((result, index) => {
        const startPos = model.getPositionAt(result.start);
        const endPos = model.getPositionAt(result.end);
        const range = new monaco.Range(
          startPos.lineNumber,
          startPos.column,
          endPos.lineNumber,
          endPos.column
        );

        const isCurrent = index === currentSearchIndex;

        newDecorations.push({
          range,
          options: {
            isWholeLine: false,
            className: isCurrent ? 'monaco-search-highlight-active' : 'monaco-search-highlight',
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        });

        // Scroll to current result
        if (isCurrent) {
          editor.revealRangeInCenter(range);
        }
      });
    }

    // Update decorations
    decorationsCollectionRef.current.set(newDecorations);

  }, [searchResults, currentSearchIndex, jsonInput]); // Depend on jsonInput to re-calc positions if text changes

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
      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      overflow: 'hidden' // Ensure editor doesn't overflow
    }}>
      {/* Inject Styles for Highlights */}
      <style>
        {`
          .monaco-search-highlight {
            background-color: ${darkMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)'};
            border-radius: 2px;
          }
          .monaco-search-highlight-active {
            background-color: ${darkMode ? 'rgba(245, 158, 11, 0.6)' : 'rgba(245, 158, 11, 0.5)'};
            border: 1px solid ${darkMode ? '#f59e0b' : '#d97706'};
            border-radius: 2px;
          }
        `}
      </style>

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
        minHeight: 0
      }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={jsonInput}
          theme={darkMode ? 'vs-dark' : 'light'}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            padding: { top: 16, bottom: 16 }
          }}
        />

        {/* Copy Button */}
        {jsonInput.trim() && (
          <button
            onClick={onCopyToClipboard}
            style={{
              position: 'absolute',
              top: '16px',
              right: '24px', // Adjusted for scrollbar
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
              zIndex: 10, // Ensure it's above Monaco
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
