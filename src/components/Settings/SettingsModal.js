import React from 'react';
import { 
  X, 
  Zap, 
  Minimize2, 
  Upload, 
  GitCompare, 
  Share2, 
  Keyboard 
} from 'lucide-react';

const SettingsModal = ({
  showSettings,
  onClose,
  darkMode,
  useVscodeTheme,
  onToggleVscodeTheme,
  indentSize,
  setIndentSize,
  loadSample,
  formatJson,
  minifyJson,
  jsonInput,
  error,
  switchViewMode,
  onShowShareModal,
  onShowKeyboardHelp
}) => {
  if (!showSettings) return null;

  const isJsonValid = jsonInput.trim() && !error;

  const actionButtonStyle = {
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        minWidth: '450px',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: 0,
            color: darkMode ? '#f9fafb' : '#111827'
          }}>
            Settings & Actions
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: darkMode ? '#9ca3af' : '#6b7280',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* JSON Tools Section */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              JSON Tools
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Format */}
              <button
                onClick={() => {
                  formatJson();
                  onClose();
                }}
                disabled={!jsonInput.trim()}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: jsonInput.trim() ? '#10b981' : '#6b7280',
                  color: 'white',
                  cursor: jsonInput.trim() ? 'pointer' : 'not-allowed',
                  opacity: jsonInput.trim() ? 1 : 0.5
                }}
              >
                <Zap size={18} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>Format JSON</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Ctrl+Shift+F</div>
                </div>
              </button>

              {/* Minify */}
              <button
                onClick={() => {
                  minifyJson();
                  onClose();
                }}
                disabled={!isJsonValid}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151',
                  cursor: isJsonValid ? 'pointer' : 'not-allowed',
                  opacity: isJsonValid ? 1 : 0.5
                }}
              >
                <Minimize2 size={18} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>Minify JSON</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Ctrl+M</div>
                </div>
              </button>

              {/* Load Sample */}
              <button
                onClick={() => {
                  loadSample();
                  onClose();
                }}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151'
                }}
              >
                <Upload size={18} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>Load Sample JSON</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Ctrl+L</div>
                </div>
              </button>
            </div>
          </div>

          {/* View Options Section */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              View Options
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Compare View */}
              <button
                onClick={() => {
                  switchViewMode('compare');
                  onClose();
                }}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151'
                }}
              >
                <GitCompare size={18} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>Compare JSON</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Side-by-side comparison</div>
                </div>
              </button>
            </div>
          </div>

          {/* Utilities Section */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Utilities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Share */}
              <button
                onClick={() => {
                  onShowShareModal();
                  onClose();
                }}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151'
                }}
              >
                <Share2 size={18} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>Share JSON</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Generate shareable link</div>
                </div>
              </button>

              {/* Keyboard Shortcuts */}
              <button
                onClick={() => {
                  onShowKeyboardHelp();
                  onClose();
                }}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151'
                }}
              >
                <Keyboard size={18} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>Keyboard Shortcuts</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>Press ? to view</div>
                </div>
              </button>
            </div>
          </div>

          {/* Editor Settings Section */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Editor Settings
            </h3>

            {/* Theme Style */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              backgroundColor: darkMode ? '#111827' : '#f9fafb',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#f3f4f6' : '#374151' }}>
                  VSCode dark theme
                </div>
                <div style={{ fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  Applies to Editor, Tree, and Graph in dark mode.
                </div>
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(useVscodeTheme)}
                  onChange={onToggleVscodeTheme}
                />
                <span style={{ fontSize: '13px', color: darkMode ? '#e5e7eb' : '#374151' }}>
                  {useVscodeTheme ? 'On' : 'Off'}
                </span>
              </label>
            </div>
            
            {/* Indent Size */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: darkMode ? '#f3f4f6' : '#374151'
              }}>
                Indent Size
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#f3f4f6' : '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
