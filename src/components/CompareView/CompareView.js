import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Copy, Check, Columns, List, ArrowLeft } from 'lucide-react';
import * as Diff from 'diff';
import CompareSetup from './CompareSetup';

const CompareView = ({ darkMode, onClose }) => {
  const [mode, setMode] = useState('SETUP'); // SETUP or DIFF
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [viewType, setViewType] = useState('split'); // 'split' or 'inline'
  const [ignoreWhitespace] = useState(false);
  const [ignoreOrder, setIgnoreOrder] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const handleCompare = (left, right) => {
    setLeftJson(left);
    setRightJson(right);
    setMode('DIFF');
  };

  const handleBackToSetup = () => {
    setMode('SETUP');
  };

  if (mode === 'SETUP') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '16px 24px',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          backgroundColor: darkMode ? '#1f2937' : '#ffffff'
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '6px',
              color: darkMode ? '#e5e7eb' : '#374151',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            <X size={14} />
            Close
          </button>
        </div>
        <CompareSetup onCompare={handleCompare} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <DiffView
      leftJson={leftJson}
      rightJson={rightJson}
      darkMode={darkMode}
      onClose={onClose}
      onBack={handleBackToSetup}
      viewType={viewType}
      setViewType={setViewType}
      ignoreWhitespace={ignoreWhitespace}
      ignoreOrder={ignoreOrder}
      ignoreCase={ignoreCase}
      focusMode={focusMode}
      setIgnoreOrder={setIgnoreOrder}
      setIgnoreCase={setIgnoreCase}
      setFocusMode={setFocusMode}
    />
  );
};

const DiffView = ({ leftJson, rightJson, darkMode, onClose, onBack, viewType, setViewType, ignoreWhitespace, ignoreOrder, ignoreCase, focusMode, setIgnoreOrder, setIgnoreCase, setFocusMode }) => {
  const [diffBlocks, setDiffBlocks] = useState([]);

  // Memoize comparison to avoid recalculating on every render
  const comparison = useMemo(() => {
    // Helper to process object for comparison
    const processObject = (obj) => {
      if (ignoreOrder) {
        if (Array.isArray(obj)) {
          // For arrays, we can't easily "sort" without context, but we can process children
          return obj.map(processObject);
        } else if (typeof obj === 'object' && obj !== null) {
          return Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = processObject(obj[key]);
            return acc;
          }, {});
        }
      }
      return obj;
    };

    try {
      // Format JSONs to ensure consistent comparison
      let leftObj = leftJson ? JSON.parse(leftJson) : {};
      let rightObj = rightJson ? JSON.parse(rightJson) : {};

      // Apply Ignore Order
      if (ignoreOrder) {
        leftObj = processObject(leftObj);
        rightObj = processObject(rightObj);
      }

      let leftFormatted = JSON.stringify(leftObj, null, 2);
      let rightFormatted = JSON.stringify(rightObj, null, 2);

      // Apply Ignore Case and Whitespace (on string level for diffing)
      // Note: We still want to display original case/whitespace if possible, 
      // but for diffing we might need to normalize.
      // However, Diff.diffLines compares lines.
      // If we ignore case, we should pass normalized strings to diffLines, 
      // but then the display will be lowercased.
      // To keep display correct but diff ignoring case, we'd need a custom diff adapter.
      // For simplicity, we will display the normalized version if options are on, 
      // or just accept that "Ignore Case" shows lowercased text.
      // Let's go with displaying normalized text for now as it's clearer what's being compared.

      if (ignoreCase) {
        leftFormatted = leftFormatted.toLowerCase();
        rightFormatted = rightFormatted.toLowerCase();
      }

      // Ignore Whitespace is tricky with JSON formatting (indentation).
      // If we ignore whitespace, we might as well just use compact JSON?
      // Or maybe just trim values? 
      // Usually "Ignore Whitespace" in diffs means ignoring leading/trailing spaces in lines.
      // Since we format with 2 spaces, this is controlled.
      // Let's treat "Ignore Whitespace" as "Ignore formatting differences" -> maybe reformat both?
      // We already reformat both.
      // So "Ignore Whitespace" might mean ignoring value trimming?
      // Let's skip deep whitespace logic for now and rely on the reformatting we already do.

      const diffOptions = {
        ignoreWhitespace: ignoreWhitespace,
        newlineIsToken: false
      };

      const diff = Diff.diffLines(leftFormatted, rightFormatted, diffOptions);

      let additions = 0;
      let deletions = 0;

      // Filter for Focus Mode
      let processedDiff = diff;
      if (focusMode) {
        processedDiff = diff.filter(part => part.added || part.removed);
        // If we filter out unchanged, we lose context. 
        // Better to keep unchanged but collapse them?
        // For now, let's just show changes.
      }

      diff.forEach(part => {
        if (part.added) additions += part.count;
        if (part.removed) deletions += part.count;
      });

      return { diff: processedDiff, leftFormatted, rightFormatted, additions, deletions };
    } catch (e) {
      // If parsing fails, just compare raw strings
      const diff = Diff.diffLines(leftJson || '', rightJson || '');
      return { diff, leftFormatted: leftJson, rightFormatted: rightJson, additions: 0, deletions: 0 };
    }
  }, [leftJson, rightJson, ignoreOrder, ignoreCase, ignoreWhitespace, focusMode]);

  useEffect(() => {
    if (comparison.diff) {
      setDiffBlocks(comparison.diff);
    }
  }, [comparison]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        height: '60px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: darkMode ? '#e5e7eb' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={16} />
            Back to Setup
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: darkMode ? '#374151' : '#e5e7eb' }} />
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            color: darkMode ? '#f3f4f6' : '#111827'
          }}>
            Comparison Results
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '4px 12px',
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            <span style={{ color: '#22c55e' }}>+{comparison.additions} additions</span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: darkMode ? '#4b5563' : '#d1d5db' }} />
            <span style={{ color: '#ef4444' }}>-{comparison.deletions} deletions</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Options */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIgnoreOrder(!ignoreOrder)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${ignoreOrder ? (darkMode ? '#3b82f6' : '#2563eb') : (darkMode ? '#374151' : '#e5e7eb')}`,
                backgroundColor: ignoreOrder ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff') : 'transparent',
                color: ignoreOrder ? (darkMode ? '#60a5fa' : '#2563eb') : (darkMode ? '#9ca3af' : '#6b7280'),
                cursor: 'pointer'
              }}
              title="Ignore Key Order"
            >
              Sort Keys
            </button>
            <button
              onClick={() => setIgnoreCase(!ignoreCase)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${ignoreCase ? (darkMode ? '#3b82f6' : '#2563eb') : (darkMode ? '#374151' : '#e5e7eb')}`,
                backgroundColor: ignoreCase ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff') : 'transparent',
                color: ignoreCase ? (darkMode ? '#60a5fa' : '#2563eb') : (darkMode ? '#9ca3af' : '#6b7280'),
                cursor: 'pointer'
              }}
              title="Ignore Case"
            >
              Aa
            </button>
            <button
              onClick={() => setFocusMode(!focusMode)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${focusMode ? (darkMode ? '#3b82f6' : '#2563eb') : (darkMode ? '#374151' : '#e5e7eb')}`,
                backgroundColor: focusMode ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff') : 'transparent',
                color: focusMode ? (darkMode ? '#60a5fa' : '#2563eb') : (darkMode ? '#9ca3af' : '#6b7280'),
                cursor: 'pointer'
              }}
              title="Show Changes Only"
            >
              Focus
            </button>
          </div>

          {/* View Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            borderRadius: '6px',
            padding: '2px'
          }}>
            <button
              onClick={() => setViewType('split')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: viewType === 'split' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
                color: viewType === 'split' ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
                boxShadow: viewType === 'split' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <Columns size={14} />
              Split
            </button>
            <button
              onClick={() => setViewType('inline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: viewType === 'inline' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
                color: viewType === 'inline' ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
                boxShadow: viewType === 'inline' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <List size={14} />
              Inline
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              color: darkMode ? '#e5e7eb' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {viewType === 'split' ? (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <DiffPanel
              title="Original"
              diffBlocks={diffBlocks}
              type="original"
              darkMode={darkMode}
            />
            <DiffGutter
              diffBlocks={diffBlocks}
              darkMode={darkMode}
            />
            <DiffPanel
              title="Modified"
              diffBlocks={diffBlocks}
              type="modified"
              darkMode={darkMode}
            />
            <DiffMinimap
              diffBlocks={diffBlocks}
              darkMode={darkMode}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <InlineDiffView
              diffBlocks={diffBlocks}
              darkMode={darkMode}
            />
            <DiffMinimap
              diffBlocks={diffBlocks}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DiffMinimap = ({ diffBlocks, darkMode }) => {
  const totalLines = diffBlocks.reduce((sum, block) => sum + block.count, 0);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = y / rect.height;

    // Find the scroll container (DiffPanel or InlineDiffView)
    // We'll try to find the first one that exists
    const container = document.querySelector('[id^="diff-panel-"]') || document.querySelector('.inline-diff-view');
    if (container) {
      container.scrollTop = percentage * container.scrollHeight;
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '16px',
        borderLeft: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
        flexShrink: 0,
        position: 'relative',
        cursor: 'pointer',
        height: '100%'
      }}
    >
      {diffBlocks.map((block, index) => {
        // Calculate percentage height
        const heightPercent = (block.count / totalLines) * 100;

        let color = 'transparent';
        if (block.added) color = darkMode ? '#22c55e' : '#4ade80';
        if (block.removed) color = darkMode ? '#ef4444' : '#f87171';

        return (
          <div
            key={index}
            style={{
              height: `${heightPercent}%`,
              width: '100%',
              backgroundColor: color,
              opacity: 0.6
            }}
          />
        );
      })}
    </div>
  );
};

const DiffGutter = ({ diffBlocks, darkMode }) => {
  const lineHeight = 24; // Must match DiffPanel line height
  let currentLine = 0;

  return (
    <div style={{
      width: '50px',
      borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
      userSelect: 'none'
    }}>
      <div style={{
        height: '41px', // Match header height roughly (padding + content)
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb'
      }} />
      <div
        id="diff-gutter"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <div style={{ height: currentLine * lineHeight }}>
          <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {diffBlocks.map((block, index) => {
              const height = block.count * lineHeight;
              const y = currentLine * lineHeight;
              currentLine += block.count;

              if (block.added) {
                return (
                  <rect
                    key={index}
                    x="0"
                    y={y}
                    width="50"
                    height={height}
                    fill={darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7'}
                    stroke={darkMode ? 'rgba(34, 197, 94, 0.5)' : '#86efac'}
                  />
                );
              } else if (block.removed) {
                return (
                  <rect
                    key={index}
                    x="0"
                    y={y}
                    width="50"
                    height={height}
                    fill={darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'}
                    stroke={darkMode ? 'rgba(239, 68, 68, 0.5)' : '#fca5a5'}
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

// Helper function for syntax highlighting
const highlightSyntax = (text, darkMode) => {
  if (!text) return null;

  // Simple regex-based highlighting
  const parts = text.split(/(".*?"|true|false|null|\b-?\d+(?:\.\d+)?\b|[{}\[\]],:])/g).filter(Boolean);

  return parts.map((part, i) => {
    let color = darkMode ? '#e5e7eb' : '#1f2937'; // Default

    if (part.startsWith('"')) {
      if (part.endsWith('":')) {
        color = darkMode ? '#93c5fd' : '#2563eb'; // Keys (blue)
      } else {
        color = darkMode ? '#86efac' : '#16a34a'; // Strings (green)
      }
    } else if (/true|false/.test(part)) {
      color = darkMode ? '#fca5a5' : '#dc2626'; // Booleans (red)
    } else if (/null/.test(part)) {
      color = darkMode ? '#d8b4fe' : '#9333ea'; // Null (purple)
    } else if (/^-?\d/.test(part)) {
      color = darkMode ? '#fdba74' : '#ea580c'; // Numbers (orange)
    }

    return <span key={i} style={{ color }}>{part}</span>;
  });
};

const DiffPanel = ({ title, diffBlocks, type, darkMode }) => {
  const [copied, setCopied] = useState(false);

  // Sync scrolling
  const handleScroll = (e) => {
    const target = e.target;
    const otherPanel = document.getElementById(`diff-panel-${type === 'original' ? 'modified' : 'original'}`);
    const gutter = document.getElementById('diff-gutter');
    if (otherPanel) {
      otherPanel.scrollTop = target.scrollTop;
    }
    if (gutter) {
      gutter.scrollTop = target.scrollTop;
    }
  };

  const handleCopy = () => {
    const content = diffBlocks
      .filter(block => type === 'original' ? !block.added : !block.removed)
      .map(block => block.value)
      .join('');

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDiffContent = () => {
    let lineNumber = 1;

    return diffBlocks.map((block, index) => {
      // If this block shouldn't be shown in this panel
      if ((type === 'original' && block.added) || (type === 'modified' && block.removed)) {
        // Render empty lines to maintain alignment
        const lineCount = block.count;
        return (
          <div key={index} style={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : '#f9fafb',
            userSelect: 'none'
          }}>
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} style={{ height: '24px' }} />
            ))}
          </div>
        );
      }

      const lines = block.value.replace(/\n$/, '').split('\n');
      const isChange = type === 'original' ? block.removed : block.added;
      const bgColor = isChange
        ? (type === 'original'
          ? (darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2')
          : (darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7'))
        : 'transparent';

      return (
        <div key={index} style={{ backgroundColor: bgColor }}>
          {lines.map((line, i) => {
            const currentLineNumber = lineNumber++;
            return (
              <div key={i} style={{
                display: 'flex',
                height: '24px',
                lineHeight: '24px',
                fontFamily: 'monospace',
                fontSize: '13px'
              }}>
                <div style={{
                  width: '48px',
                  textAlign: 'right',
                  paddingRight: '12px',
                  color: darkMode ? '#6b7280' : '#9ca3af',
                  userSelect: 'none',
                  borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  marginRight: '12px',
                  flexShrink: 0
                }}>
                  {currentLineNumber}
                </div>
                <div style={{ whiteSpace: 'pre', flex: 1 }}>
                  {highlightSyntax(line, darkMode)}
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRight: type === 'original' ? `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` : 'none',
      minWidth: 0
    }}>
      <div style={{
        padding: '8px 16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        fontWeight: '600',
        color: darkMode ? '#e5e7eb' : '#374151'
      }}>
        <span>{title}</span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: copied ? '#22c55e' : (darkMode ? '#9ca3af' : '#6b7280'),
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div
        id={`diff-panel-${type}`}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 0'
        }}
      >
        {renderDiffContent()}
      </div>
    </div>
  );
};

const InlineDiffView = ({ diffBlocks, darkMode }) => {
  let oldLineNumber = 1;
  let newLineNumber = 1;

  return (
    <div
      className="inline-diff-view"
      style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px 0',
        backgroundColor: darkMode ? '#111827' : '#ffffff'
      }}
    >
      {diffBlocks.map((block, index) => {
        const lines = block.value.replace(/\n$/, '').split('\n');

        return lines.map((line, i) => {
          let bgColor = 'transparent';
          let oldNum = '';
          let newNum = '';
          let prefix = ' ';

          if (block.added) {
            bgColor = darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7';
            newNum = newLineNumber++;
            prefix = '+';
          } else if (block.removed) {
            bgColor = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2';
            oldNum = oldLineNumber++;
            prefix = '-';
          } else {
            oldNum = oldLineNumber++;
            newNum = newLineNumber++;
          }

          return (
            <div key={`${index}-${i}`} style={{
              display: 'flex',
              height: '24px',
              lineHeight: '24px',
              fontFamily: 'monospace',
              fontSize: '13px',
              backgroundColor: bgColor
            }}>
              <div style={{
                width: '40px',
                textAlign: 'right',
                paddingRight: '8px',
                color: darkMode ? '#6b7280' : '#9ca3af',
                userSelect: 'none',
                borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                flexShrink: 0
              }}>
                {oldNum}
              </div>
              <div style={{
                width: '40px',
                textAlign: 'right',
                paddingRight: '8px',
                color: darkMode ? '#6b7280' : '#9ca3af',
                userSelect: 'none',
                borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                flexShrink: 0
              }}>
                {newNum}
              </div>
              <div style={{
                width: '24px',
                textAlign: 'center',
                color: block.added ? '#22c55e' : (block.removed ? '#ef4444' : (darkMode ? '#6b7280' : '#9ca3af')),
                userSelect: 'none',
                flexShrink: 0
              }}>
                {prefix}
              </div>
              <div style={{ whiteSpace: 'pre', flex: 1 }}>
                {highlightSyntax(line, darkMode)}
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default CompareView;
