import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Copy, Check, GitCompare, X, Upload, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  const leftFileInputRef = useRef(null);
  const rightFileInputRef = useRef(null);
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  // Parse and compare JSON
  const comparison = useMemo(() => {
    if (!leftJson.trim() || !rightJson.trim()) {
      return { differences: [], identical: false, leftFormatted: '', rightFormatted: '', lineDiffs: [], changedLines: 0, diffBlocks: [] };
    }

    try {
      const leftParsed = JSON.parse(leftJson);
      const rightParsed = JSON.parse(rightJson);
      
      // Format both for comparison
      const leftFormatted = JSON.stringify(leftParsed, null, 2);
      const rightFormatted = JSON.stringify(rightParsed, null, 2);
      
      const diffs = findDifferences(leftParsed, rightParsed);
      const lineDiffs = Diff.diffLines(leftFormatted, rightFormatted);
      const identical = diffs.length === 0 && leftFormatted === rightFormatted;
      
      // Build diff blocks with line numbers
      const diffBlocks = [];
      let lineNumber = 0;
      
      lineDiffs.forEach((part) => {
        const lines = part.value.split('\n');
        if (lines[lines.length - 1] === '') {
          lines.pop();
        }
        
        if (part.added || part.removed) {
          diffBlocks.push({
            startLine: lineNumber,
            endLine: lineNumber + lines.length - 1,
            type: part.added ? 'added' : 'removed',
            lineCount: lines.length
          });
        }
        
        lineNumber += lines.length;
      });
      
      // Count total changed lines
      const changedLines = diffBlocks.reduce((sum, block) => sum + block.lineCount, 0);
      
      return { 
        differences: diffs, 
        identical,
        leftFormatted,
        rightFormatted,
        lineDiffs,
        changedLines,
        diffBlocks
      };
    } catch (e) {
      return { differences: [], identical: false, error: true, lineDiffs: [], changedLines: 0, diffBlocks: [] };
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

  const handleFileUpload = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (side === 'left') {
        setLeftJson(content);
        try {
          JSON.parse(content);
          setLeftError('');
        } catch (err) {
          setLeftError(err.message);
        }
      } else {
        setRightJson(content);
        try {
          JSON.parse(content);
          setRightError('');
        } catch (err) {
          setRightError(err.message);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

  const handleNewCompare = () => {
    setLeftJson('');
    setRightJson('');
    setLeftError('');
    setRightError('');
    setCopied(null);
    setCurrentDiffIndex(0);
  };

  useEffect(() => {
    setCurrentDiffIndex(0);
  }, [comparison.diffBlocks.length]);

  const navigateToDiff = (index) => {
    if (index < 0 || index >= comparison.diffBlocks.length) return;
    setCurrentDiffIndex(index);
    const block = comparison.diffBlocks[index];
    if (leftScrollRef.current && rightScrollRef.current) {
      const lineHeight = 20.8;
      const scrollPosition = block.startLine * lineHeight;
      leftScrollRef.current.scrollTop = scrollPosition;
      rightScrollRef.current.scrollTop = scrollPosition;
    }
  };

  const goToPreviousDiff = () => {
    if (currentDiffIndex > 0) {
      navigateToDiff(currentDiffIndex - 1);
    }
  };

  const goToNextDiff = () => {
    if (currentDiffIndex < comparison.diffBlocks.length - 1) {
      navigateToDiff(currentDiffIndex + 1);
    }
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
          {leftJson.trim() && rightJson.trim() && !leftError && !rightError && !comparison.identical && comparison.diffBlocks.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <button
                onClick={goToPreviousDiff}
                disabled={currentDiffIndex === 0}
                style={{
                  padding: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentDiffIndex === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: currentDiffIndex === 0 ? 0.5 : 1,
                  transition: 'opacity 0.2s'
                }}
                title="Previous difference"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span style={{ userSelect: 'none', minWidth: '60px', textAlign: 'center' }}>
                {currentDiffIndex + 1} of {comparison.diffBlocks.length}
              </span>
              
              <button
                onClick={goToNextDiff}
                disabled={currentDiffIndex === comparison.diffBlocks.length - 1}
                style={{
                  padding: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentDiffIndex === comparison.diffBlocks.length - 1 ? 'not-allowed' : 'pointer',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: currentDiffIndex === comparison.diffBlocks.length - 1 ? 0.5 : 1,
                  transition: 'opacity 0.2s'
                }}
                title="Next difference"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          
          {leftJson.trim() && rightJson.trim() && !leftError && !rightError && comparison.identical && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: darkMode ? '#064e3b' : '#d1fae5',
              color: darkMode ? '#6ee7b7' : '#047857'
            }}>
              ✓ Identical
            </div>
          )}

          <button
            onClick={handleNewCompare}
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
              opacity: !leftJson.trim() && !rightJson.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Start a new comparison"
          >
            <RefreshCw size={16} />
            New Compare
          </button>

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

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        minHeight: 0
      }}>
        <DiffPanel
          json={leftJson}
          formattedJson={comparison.leftFormatted}
          error={leftError}
          side="left"
          label="Original"
          darkMode={darkMode}
          copied={copied === 'left'}
          lineDiffs={comparison.lineDiffs}
          diffBlocks={comparison.diffBlocks}
          currentDiffIndex={currentDiffIndex}
          onJsonChange={handleLeftChange}
          onFormat={() => formatJson(leftJson, 'left')}
          onCopy={() => copyToClipboard(leftJson, 'left')}
          onFileUpload={(e) => handleFileUpload(e, 'left')}
          fileInputRef={leftFileInputRef}
          scrollRef={leftScrollRef}
          otherScrollRef={rightScrollRef}
        />

        <DiffPanel
          json={rightJson}
          formattedJson={comparison.rightFormatted}
          error={rightError}
          side="right"
          label="Modified"
          darkMode={darkMode}
          copied={copied === 'right'}
          lineDiffs={comparison.lineDiffs}
          diffBlocks={comparison.diffBlocks}
          currentDiffIndex={currentDiffIndex}
          onJsonChange={handleRightChange}
          onFormat={() => formatJson(rightJson, 'right')}
          onCopy={() => copyToClipboard(rightJson, 'right')}
          onFileUpload={(e) => handleFileUpload(e, 'right')}
          fileInputRef={rightFileInputRef}
          scrollRef={rightScrollRef}
          otherScrollRef={leftScrollRef}
        />
      </div>
    </div>
  );
};

const DiffPanel = ({
  json,
  formattedJson,
  error,
  side,
  label,
  darkMode,
  copied,
  lineDiffs,
  diffBlocks,
  currentDiffIndex,
  onJsonChange,
  onFormat,
  onCopy,
  onFileUpload,
  fileInputRef,
  scrollRef,
  otherScrollRef
}) => {
  const lines = (formattedJson || json).split('\n');
  const maxLineNumber = lines.length;
  const lineNumberWidth = Math.max(String(maxLineNumber).length * 8 + 16, 50);

  // Handle synchronized scrolling with debounce to prevent infinite loops
  const handleScroll = (e) => {
    if (otherScrollRef.current) {
      // Use requestAnimationFrame to sync smoothly
      requestAnimationFrame(() => {
        if (otherScrollRef.current) {
          otherScrollRef.current.scrollTop = e.target.scrollTop;
          otherScrollRef.current.scrollLeft = e.target.scrollLeft;
        }
      });
    }
  };

  const renderDiffContent = () => {
    if (!formattedJson || lineDiffs.length === 0) {
      return null;
    }

    const renderedLines = [];
    let lineIndex = 0;
    
    lineDiffs.forEach((part) => {
      const isAdded = part.added;
      const isRemoved = part.removed;
      
      if ((side === 'left' && isAdded) || (side === 'right' && isRemoved)) {
        return;
      }
      
      const lineArray = part.value.split('\n');
      if (lineArray[lineArray.length - 1] === '') {
        lineArray.pop();
      }
      
      lineArray.forEach((line) => {
        renderedLines.push({
          content: line,
          isHighlighted: (side === 'left' && isRemoved) || (side === 'right' && isAdded),
          type: isRemoved ? 'removed' : isAdded ? 'added' : 'unchanged',
          lineNumber: lineIndex
        });
        lineIndex++;
      });
    });

    return renderedLines;
  };

  const diffLines = renderDiffContent();
  
  const isInCurrentDiffBlock = (lineNum) => {
    if (!diffBlocks || diffBlocks.length === 0 || currentDiffIndex < 0) return false;
    const currentBlock = diffBlocks[currentDiffIndex];
    if (!currentBlock) return false;
    return lineNum >= currentBlock.startLine && lineNum <= currentBlock.endLine;
  };

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
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Load JSON from file"
          >
            <Upload size={12} />
            Load
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={onFileUpload}
            style={{ display: 'none' }}
          />
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

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'auto',
          position: 'relative',
          backgroundColor: darkMode ? '#111827' : '#ffffff',
          minHeight: 0
        }}
      >
        {diffLines ? (
          <>
            {/* Line numbers */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${lineNumberWidth}px`,
              backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
              borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              color: darkMode ? '#6b7280' : '#9ca3af',
              textAlign: 'right',
              userSelect: 'none',
              pointerEvents: 'none'
            }}>
              <div style={{ padding: '16px 0' }}>
                {diffLines.map((line, index) => {
                  const isCurrentDiff = isInCurrentDiffBlock(line.lineNumber);
                  return (
                    <div
                      key={index}
                      style={{
                        padding: '0 8px',
                        minHeight: '20.8px',
                        backgroundColor: isCurrentDiff && line.isHighlighted
                          ? (side === 'left' 
                              ? (darkMode ? 'rgba(220, 38, 38, 0.35)' : 'rgba(254, 226, 226, 0.9)')
                              : (darkMode ? 'rgba(5, 150, 105, 0.35)' : 'rgba(167, 243, 208, 0.9)'))
                          : line.isHighlighted 
                            ? (side === 'left' 
                                ? (darkMode ? 'rgba(220, 38, 38, 0.15)' : 'rgba(254, 226, 226, 0.5)')
                                : (darkMode ? 'rgba(5, 150, 105, 0.15)' : 'rgba(167, 243, 208, 0.5)'))
                            : 'transparent'
                      }}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content with line-level highlighting */}
            <div style={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              paddingLeft: `${lineNumberWidth}px`
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
                {diffLines.map((line, lineIndex) => {
                  const isCurrentDiff = isInCurrentDiffBlock(line.lineNumber);
                  return (
                    <div 
                      key={lineIndex} 
                      style={{ 
                        minHeight: '20.8px',
                        backgroundColor: isCurrentDiff && line.isHighlighted
                          ? (side === 'left' 
                              ? (darkMode ? 'rgba(220, 38, 38, 0.35)' : 'rgba(254, 226, 226, 0.9)')
                              : (darkMode ? 'rgba(5, 150, 105, 0.35)' : 'rgba(167, 243, 208, 0.9)'))
                          : line.isHighlighted 
                            ? (side === 'left' 
                                ? (darkMode ? 'rgba(220, 38, 38, 0.25)' : 'rgba(254, 226, 226, 0.7)')
                                : (darkMode ? 'rgba(5, 150, 105, 0.25)' : 'rgba(167, 243, 208, 0.7)'))
                            : 'transparent',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                        marginLeft: '-4px',
                        marginRight: '-4px',
                        border: isCurrentDiff && line.isHighlighted ? `2px solid ${side === 'left' ? (darkMode ? '#dc2626' : '#b91c1c') : (darkMode ? '#059669' : '#047857')}` : 'none',
                        borderLeft: 'none',
                        borderRight: 'none'
                      }}
                    >
                      <span style={{
                        color: line.isHighlighted 
                          ? (side === 'left' 
                              ? (darkMode ? '#fca5a5' : '#991b1b')
                              : (darkMode ? '#6ee7b7' : '#065f46'))
                          : 'inherit'
                      }}>
                        {line.content || ' '}
                      </span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </>
        ) : (
          <textarea
            value={json}
            onChange={onJsonChange}
            placeholder={`Paste ${label.toLowerCase()} JSON here or click "Load" to upload a file...`}
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
