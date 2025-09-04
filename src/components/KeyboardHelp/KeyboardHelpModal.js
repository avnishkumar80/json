import React from 'react';
import { X, Keyboard } from 'lucide-react';

const KeyboardHelpModal = ({ isOpen, onClose, shortcuts, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Keyboard 
              size={24} 
              color={darkMode ? '#60a5fa' : '#3b82f6'} 
            />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: darkMode ? '#f9fafb' : '#111827',
              margin: 0
            }}>
              Keyboard Shortcuts
            </h2>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6'
            }}
          >
            <X size={20} color={darkMode ? '#9ca3af' : '#6b7280'} />
          </button>
        </div>

        {/* Description */}
        <p style={{
          color: darkMode ? '#9ca3af' : '#6b7280',
          marginBottom: '32px',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          Use these keyboard shortcuts to work faster with JSON formatting and validation.
          Most shortcuts work with both <strong>Ctrl</strong> (Windows/Linux) and <strong>⌘</strong> (Mac).
        </p>

        {/* Shortcuts Grid */}
        <div style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: '1fr'
        }}>
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '12px',
                border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
              }}
            >
              {/* Shortcut Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: darkMode ? '#f9fafb' : '#1e293b',
                  marginBottom: '4px'
                }}>
                  {shortcut.action}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: darkMode ? '#9ca3af' : '#64748b'
                }}>
                  {shortcut.description}
                </div>
              </div>
              
              {/* Key Combination */}
              <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
              }}>
                {shortcut.key.split(' + ').map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    {keyIndex > 0 && (
                      <span style={{
                        color: darkMode ? '#6b7280' : '#9ca3af',
                        fontSize: '12px',
                        margin: '0 2px'
                      }}>
                        +
                      </span>
                    )}
                    <kbd style={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      color: darkMode ? '#e5e7eb' : '#374151',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
                      fontWeight: '500',
                      border: darkMode 
                        ? '1px solid #4b5563' 
                        : '1px solid #d1d5db',
                      boxShadow: darkMode 
                        ? '0 1px 2px rgba(0, 0, 0, 0.3)' 
                        : '0 1px 2px rgba(0, 0, 0, 0.1)',
                      minWidth: '24px',
                      textAlign: 'center'
                    }}>
                      {key.replace('Ctrl/Cmd', '⌃/⌘')}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: darkMode ? '#1f2937' : '#f1f5f9',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{
            color: darkMode ? '#9ca3af' : '#64748b',
            fontSize: '14px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            💡 <strong>Pro Tip:</strong> These shortcuts work anywhere in the app, 
            except when typing in input fields (other than the main JSON editor).
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardHelpModal;
