import React, { useState, useMemo } from 'react';
import { Copy, Check, GitCompare, X } from 'lucide-react';
import * as Diff from 'diff';

const CompareView = ({
  darkMode,
  onClose
}) => {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [leftError, setLeftError] = useState('');
  const [rightError, setRightError] = useState('');
  const [copied, setCopied] = useState(null);

  // Parse and compare JSON
  const comparison = useMemo(() => {
    if (!leftJson.trim() || !rightJson.trim()) {
      return { differences: [], identical: false, leftFormatted: '', rightFormatted: '', charDiffs: [] };
    }

    try {
      const leftParsed = JSON.parse(leftJson);
      const rightParsed = JSON.parse(rightJson);
      
      // Format both for comparison
      const leftFormatted = JSON.stringify(leftParsed, null, 2);
      const rightFormatted = JSON.stringify(rightParsed, null, 2);
      
      const diffs = findDifferences(leftParsed, rightParsed);
      const charDiffs = Diff.diffWords(leftFormatted, rightFormatted);
      const identical = diffs.length === 0 && leftFormatted === rightFormatted;
      
      return { 
        differences: diffs, 
        identical,
        leftFormatted,
        rightFormatted,
        charDiffs
      };
    } catch (e) {
      return { differences: [], identical: false, error: true, charDiffs: [] };
    }
  }, [leftJson, rightJson]);

  const handleLeftChange = (e) => {
    const value = e.target.value;
    setLeftJson(value);
    
    if (value.trim()) {
      try {
        JSON.parse(value);
        setLeftError('');
      } catch (err) {
        setLeftError(err.message);
      }
    } else {
      setLeftError('');
    }
  };

  const handleRightChange = (e) => {
    const value = e.target.value;
    setRightJson(value);
    
    if (value.trim()) {
      try {
        JSON.parse(value);
        setRightError('');
      } catch (err) {
        setRightError(err.message);
      }
    } else {
      setRightError('');
    }
  };

  const copyToClipboard = async (text, side) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(side);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const formatJson = (text, side) => {
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      if (side === 'left') {
        setLeftJson(formatted);
      } else {
        setRightJson(formatted);
      }
    } catch (e) {
      // Invalid JSON, do nothing
    }
  };

  const swapSides = () => {
    const temp = leftJson;
    setLeftJson(rightJson);
    setRightJson(temp);
    
    const tempError = leftError;
    setLeftError(rightError);
    setRightError(tempError);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode ? '#111827' : '#ffffff',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GitCompare size={24} color={darkMode ? '#10b981' : '#059669'} />
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
            color: darkMode ? '#f3f4f6' : '#111827'
          }}>
            Compare JSON Files
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Comparison Status */}
          {leftJson.trim() && rightJson.trim() && !leftError && !rightError && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: comparison.identical 
                ? (darkMode ? '#064e3b' : '#d1fae5')
                : (darkMode ? '#7c2d12' : '#fed7aa'),
              color: comparison.identical
                ? (darkMode ? '#6ee7b7' : '#047857')
                : (darkMode ? '#fdba74' : '#c2410c')
            }}>
              {comparison.identical ? '✓ Identical' : `${comparison.differences.length} Difference${comparison.differences.length !== 1 ? 's' : ''}`}
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={swapSides}
            disabled={!leftJson.trim() && !rightJson.trim()}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: !leftJson.trim() && !rightJson.trim() ? 'not-allowed' : 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              opacity: !leftJson.trim() && !rightJson.trim() ? 0.5 : 1
            }}
            title="Swap sides"
          >
            ⇄ Swap
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Close compare view"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Comparison Content */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Left Panel */}
        <DiffPanel
          json={leftJson}
          formattedJson={comparison.leftFormatted}
          error={leftError}
          side="left"
          label="Original"
          darkMode={darkMode}
          copied={copied === 'left'}
          charDiffs={comparison.charDiffs}
          onJsonChange={handleLeftChange}
          onFormat={() => formatJson(leftJson, 'left')}
          onCopy={() => copyToClipboard(leftJson, 'left')}
        />

        {/* Right Panel */}
        <DiffPanel
          json={rightJson}
          formattedJson={comparison.rightFormatted}
          error={rightError}
          side="right"
          label="Modified"
          darkMode={darkMode}
          copied={copied === 'right'}
          charDiffs={comparison.charDiffs}
          onJsonChange={handleRightChange}
          onFormat={() => formatJson(rightJson, 'right')}
          onCopy={() => copyToClipboard(rightJson, 'right')}
        />
      </div>
    </div>
  );
};

// Diff Panel Component with inline character-level highlighting
const DiffPanel = ({
  json,
  formattedJson,
  error,
  side,
  label,
  darkMode,
  copied,
  charDiffs,
  onJsonChange,
  onFormat,
  onCopy
}) => {
  const lines = (formattedJson || json).split('\n');
  const maxLineNumber = lines.length;
  const lineNumberWidth = Math.max(String(maxLineNumber).length * 8 + 16, 50);

  // Render content with inline diff highlighting
  const renderDiffContent = () => {
    if (!formattedJson || charDiffs.length === 0) {
      return null;
    }

    let lineNumber = 1;
    const renderedLines = [];
    let currentLine = [];
    let charIndex = 0;

    charDiffs.forEach((part, partIndex) => {
      const text = part.value;
      const isAdded = part.added;
      const isRemoved = part.removed;
      const isUnchanged = !isAdded && !isRemoved;

      // Show removed parts only on left side, added only on right side
      if ((side === 'left' && isAdded) || (side === 'right' && isRemoved)) {
        return; // Skip this part for this side
      }

      const chars = text.split('');
      
      chars.forEach((char, charIdx) => {
        if (char === '\n') {
          // End of line - push current line
          renderedLines.push({
            lineNumber: lineNumber,
            content: currentLine,
            hasChanges: currentLine.some(c => c.isHighlighted)
          });
          lineNumber++;
          currentLine = [];
        } else {
          currentLine.push({
            char: char,
            isHighlighted: (side === 'left' && isRemoved) || (side === 'right' && isAdded),
            type: isRemoved ? 'removed' : isAdded ? 'added' : 'unchanged'
          });
        }
        charIndex++;
      });
    });

    // Push last line if exists
    if (currentLine.length > 0) {
      renderedLines.push({
        lineNumber: lineNumber,
        content: currentLine,
        hasChanges: currentLine.some(c => c.isHighlighted)
      });
    }

    return renderedLines;
  };

  const diffLines = renderDiffContent();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      borderRight: side === 'left' ? `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}` : 'none',
      minWidth: 0,
      width: '100%',
      minHeight: 0,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: darkMode ? '#f3f4f6' : '#111827'
        }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onFormat}
            disabled={!json.trim() || !!error}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              cursor: !json.trim() || !!error ? 'not-allowed' : 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '12px',
              opacity: !json.trim() || !!error ? 0.5 : 1
            }}
          >
            Format
          </button>
          <button
            onClick={onCopy}
            disabled={!json.trim()}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              cursor: !json.trim() ? 'not-allowed' : 'pointer',
              backgroundColor: copied ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
              color: copied ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2',
          color: darkMode ? '#fca5a5' : '#dc2626',
          padding: '8px 16px',
          fontSize: '12px',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
        }}>
          {error}
        </div>
      )}

      {/* Editor with inline highlighting */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        position: 'relative',
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        minHeight: 0
      }}>
        {diffLines ? (
          <>
            {/* Line numbers */}
            <div style={{
              width: `${lineNumberWidth}px`,
              backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
              borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              padding: '16px 0',
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              color: darkMode ? '#6b7280' : '#9ca3af',
              textAlign: 'right',
              userSelect: 'none',
              flexShrink: 0,
              overflowY: 'hidden'
            }}>
              {diffLines.map((line, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0 8px',
                    minHeight: '20.8px'
                  }}
                >
                  {line.lineNumber}
                </div>
              ))}
            </div>

            {/* Content with character-level highlighting */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              minHeight: 0,
              minWidth: 0
            }}>
              <pre style={{
                margin: 0,
                padding: '16px',
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                color: darkMode ? '#f3f4f6' : '#111827',
                whiteSpace: 'pre',
                overflowX: 'auto',
                minWidth: 'fit-content'
              }}>
                {diffLines.map((line, lineIndex) => (
                  <div key={lineIndex} style={{ minHeight: '20.8px' }}>
                    {line.content.map((charData, charIndex) => (
                      <span
                        key={charIndex}
                        style={{
                          backgroundColor: charData.isHighlighted 
                            ? (side === 'left' 
                                ? (darkMode ? 'rgba(220, 38, 38, 0.25)' : 'rgba(254, 226, 226, 0.7)')
                                : (darkMode ? 'rgba(5, 150, 105, 0.25)' : 'rgba(167, 243, 208, 0.7)'))
                            : 'transparent',
                          color: charData.isHighlighted 
                            ? (side === 'left' 
                                ? (darkMode ? '#fca5a5' : '#991b1b')
                                : (darkMode ? '#6ee7b7' : '#065f46'))
                            : 'inherit'
                        }}
                      >
                        {charData.char}
                      </span>
                    ))}
                  </div>
                ))}
              </pre>
            </div>
          </>
        ) : (
          <textarea
            value={json}
            onChange={onJsonChange}
            placeholder={`Paste ${label.toLowerCase()} JSON here...`}
            style={{
              width: '100%',
              height: '100%',
              padding: '16px',
              paddingLeft: `${lineNumberWidth + 16}px`,
              border: 'none',
              resize: 'none',
              outline: 'none',
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              backgroundColor: 'transparent',
              color: darkMode ? '#f3f4f6' : '#111827',
              tabSize: 2
            }}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
};

// Helper function to find structural differences
const findDifferences = (obj1, obj2, path = '') => {
  const differences = [];

  const traverse = (left, right, currentPath) => {
    const leftType = Array.isArray(left) ? 'array' : typeof left;
    const rightType = Array.isArray(right) ? 'array' : typeof right;

    if (leftType !== rightType) {
      differences.push({
        path: currentPath,
        type: 'type_mismatch',
        left: left,
        right: right
      });
      return;
    }

    if (left === null || right === null) {
      if (left !== right) {
        differences.push({
          path: currentPath,
          type: 'value_change',
          left: left,
          right: right
        });
      }
      return;
    }

    if (leftType !== 'object') {
      if (left !== right) {
        differences.push({
          path: currentPath,
          type: 'value_change',
          left: left,
          right: right
        });
      }
      return;
    }

    if (Array.isArray(left)) {
      if (left.length !== right.length) {
        differences.push({
          path: currentPath,
          type: 'array_length',
          left: `length: ${left.length}`,
          right: `length: ${right.length}`
        });
      }

      const maxLength = Math.max(left.length, right.length);
      for (let i = 0; i < maxLength; i++) {
        const itemPath = `${currentPath}[${i}]`;
        if (i >= left.length) {
          differences.push({
            path: itemPath,
            type: 'added',
            left: undefined,
            right: right[i]
          });
        } else if (i >= right.length) {
          differences.push({
            path: itemPath,
            type: 'removed',
            left: left[i],
            right: undefined
          });
        } else {
          traverse(left[i], right[i], itemPath);
        }
      }
      return;
    }

    const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);
    
    for (const key of allKeys) {
      const keyPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (!(key in left)) {
        differences.push({
          path: keyPath,
          type: 'added',
          left: undefined,
          right: right[key]
        });
      } else if (!(key in right)) {
        differences.push({
          path: keyPath,
          type: 'removed',
          left: left[key],
          right: undefined
        });
      } else {
        traverse(left[key], right[key], keyPath);
      }
    }
  };

  traverse(obj1, obj2, path);
  return differences;
};

export default CompareView;
