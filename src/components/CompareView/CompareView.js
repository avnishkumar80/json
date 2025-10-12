import React, { useState, useMemo } from 'react';
import { Copy, Check, GitCompare, X } from 'lucide-react';

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
      return { differences: [], identical: false };
    }

    try {
      const leftParsed = JSON.parse(leftJson);
      const rightParsed = JSON.parse(rightJson);
      
      const diffs = findDifferences(leftParsed, rightParsed);
      const identical = diffs.length === 0 && JSON.stringify(leftParsed) === JSON.stringify(rightParsed);
      
      return { differences: diffs, identical };
    } catch (e) {
      return { differences: [], identical: false, error: true };
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
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: `2px solid ${darkMode ? '#4b5563' : '#d1d5db'}`
        }}>
          {/* Left Header */}
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
              Original
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => formatJson(leftJson, 'left')}
                disabled={!leftJson.trim() || !!leftError}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !leftJson.trim() || !!leftError ? 'not-allowed' : 'pointer',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151',
                  fontSize: '12px',
                  opacity: !leftJson.trim() || !!leftError ? 0.5 : 1
                }}
              >
                Format
              </button>
              <button
                onClick={() => copyToClipboard(leftJson, 'left')}
                disabled={!leftJson.trim()}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !leftJson.trim() ? 'not-allowed' : 'pointer',
                  backgroundColor: copied === 'left' ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
                  color: copied === 'left' ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied === 'left' ? <Check size={12} /> : <Copy size={12} />}
                {copied === 'left' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Left Error */}
          {leftError && (
            <div style={{
              backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2',
              color: darkMode ? '#fca5a5' : '#dc2626',
              padding: '8px 16px',
              fontSize: '12px',
              borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
            }}>
              {leftError}
            </div>
          )}

          {/* Left Editor */}
          <textarea
            value={leftJson}
            onChange={handleLeftChange}
            placeholder="Paste first JSON here..."
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              resize: 'none',
              outline: 'none',
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              backgroundColor: darkMode ? '#111827' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#111827',
              tabSize: 2
            }}
            spellCheck={false}
          />
        </div>

        {/* Right Panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Right Header */}
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
              Modified
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => formatJson(rightJson, 'right')}
                disabled={!rightJson.trim() || !!rightError}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !rightJson.trim() || !!rightError ? 'not-allowed' : 'pointer',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151',
                  fontSize: '12px',
                  opacity: !rightJson.trim() || !!rightError ? 0.5 : 1
                }}
              >
                Format
              </button>
              <button
                onClick={() => copyToClipboard(rightJson, 'right')}
                disabled={!rightJson.trim()}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !rightJson.trim() ? 'not-allowed' : 'pointer',
                  backgroundColor: copied === 'right' ? '#10b981' : (darkMode ? '#374151' : '#f3f4f6'),
                  color: copied === 'right' ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied === 'right' ? <Check size={12} /> : <Copy size={12} />}
                {copied === 'right' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Right Error */}
          {rightError && (
            <div style={{
              backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2',
              color: darkMode ? '#fca5a5' : '#dc2626',
              padding: '8px 16px',
              fontSize: '12px',
              borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
            }}>
              {rightError}
            </div>
          )}

          {/* Right Editor */}
          <textarea
            value={rightJson}
            onChange={handleRightChange}
            placeholder="Paste second JSON here..."
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              resize: 'none',
              outline: 'none',
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              backgroundColor: darkMode ? '#111827' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#111827',
              tabSize: 2
            }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Differences Panel */}
      {leftJson.trim() && rightJson.trim() && !leftError && !rightError && (
        <div style={{
          maxHeight: '250px',
          minHeight: comparison.differences.length > 0 ? '150px' : 'auto',
          overflow: 'auto',
          borderTop: `2px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
          backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
          padding: '16px'
        }}>
          {comparison.differences.length > 0 ? (
            <>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: darkMode ? '#f3f4f6' : '#111827'
              }}>
                Differences Found ({comparison.differences.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {comparison.differences.map((diff, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                      fontSize: '13px'
                    }}
                  >
                    <div style={{
                      color: darkMode ? '#fbbf24' : '#d97706',
                      fontWeight: '600',
                      marginBottom: '6px',
                      fontFamily: 'monospace',
                      fontSize: '13px'
                    }}>
                      📍 {diff.path || 'root'}
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      fontSize: '12px'
                    }}>
                      <div style={{
                        padding: '6px 8px',
                        backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
                        borderRadius: '4px',
                        border: `1px solid ${darkMode ? '#991b1b' : '#fecaca'}`
                      }}>
                        <div style={{ 
                          color: darkMode ? '#fca5a5' : '#991b1b',
                          fontSize: '11px',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          ORIGINAL
                        </div>
                        <div style={{ 
                          color: darkMode ? '#f87171' : '#dc2626',
                          fontFamily: 'monospace',
                          wordBreak: 'break-word'
                        }}>
                          {diff.left === undefined ? '(not present)' : JSON.stringify(diff.left, null, 2)}
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 8px',
                        backgroundColor: darkMode ? '#064e3b' : '#d1fae5',
                        borderRadius: '4px',
                        border: `1px solid ${darkMode ? '#065f46' : '#a7f3d0'}`
                      }}>
                        <div style={{ 
                          color: darkMode ? '#6ee7b7' : '#065f46',
                          fontSize: '11px',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          MODIFIED
                        </div>
                        <div style={{ 
                          color: darkMode ? '#34d399' : '#059669',
                          fontFamily: 'monospace',
                          wordBreak: 'break-word'
                        }}>
                          {diff.right === undefined ? '(not present)' : JSON.stringify(diff.right, null, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: darkMode ? '#6ee7b7' : '#059669',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✓ The JSON files are identical
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to find differences between two JSON objects
const findDifferences = (obj1, obj2, path = '') => {
  const differences = [];

  const traverse = (left, right, currentPath) => {
    // Check if types are different
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

    // Handle null
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

    // Handle primitives
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

    // Handle arrays
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

    // Handle objects
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
