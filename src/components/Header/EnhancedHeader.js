import React from 'react';
import { 
  FileText, 
  Sun, 
  Moon, 
  Search, 
  Keyboard, 
  Share2,
  Zap,
  FolderOpen,
  Download,
  Save,
  Minimize2,
  RotateCcw,
  Upload,
  Settings,
  TreePine,
  GitCompare
} from 'lucide-react';

const EnhancedHeader = ({
  darkMode,
  toggleTheme,
  toggleSearch,
  showSearch,
  currentFileName,
  hasUnsavedChanges,
  onShowKeyboardHelp,
  onShowShareModal,
  // New props for actions
  formatJson,
  minifyJson,
  clearInput,
  loadSample,
  openFile,
  saveFile,
  jsonInput,
  error,
  viewMode,
  switchViewMode,
  setShowSettings
}) => {
  const isJsonValid = jsonInput.trim() && !error;

  const iconButtonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap'
  };

  const primaryButtonStyle = {
    ...iconButtonStyle,
    backgroundColor: jsonInput.trim() ? '#10b981' : '#6b7280',
    color: 'white',
    cursor: jsonInput.trim() ? 'pointer' : 'not-allowed',
    opacity: jsonInput.trim() ? 1 : 0.5
  };

  const secondaryButtonStyle = {
    ...iconButtonStyle,
    backgroundColor: darkMode ? '#374151' : '#f3f4f6',
    color: darkMode ? '#d1d5db' : '#374151'
  };

  const viewButtonStyle = (isActive) => ({
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: isActive ? (darkMode ? '#4b5563' : '#e5e7eb') : 'transparent',
    color: isActive ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
    transition: 'all 0.15s'
  });

  return (
    <>
      <style>
        {`
          .header-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header-btn.primary:hover:not(:disabled) {
            background-color: #059669 !important;
          }
          .header-btn.secondary:hover {
            background-color: ${darkMode ? '#4b5563' : '#e5e7eb'} !important;
          }
          .header-btn:active {
            transform: translateY(0);
          }
          .header-divider {
            width: 1px;
            height: 24px;
            background-color: ${darkMode ? '#374151' : '#e5e7eb'};
            margin: 0 4px;
          }
        `}
      </style>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        boxShadow: darkMode 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.2)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          maxWidth: '100%',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Brand Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
            <div style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <FileText size={20} />
            </div>
            
            <div>
              <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
                color: darkMode ? '#ffffff' : '#1f2937'
              }}>
                GuidedJSON
              </h1>
              
              {currentFileName && (
                <div style={{
                  fontSize: '11px',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginTop: '2px'
                }}>
                  {currentFileName}
                  {hasUnsavedChanges && ' • Unsaved'}
                </div>
              )}
            </div>
          </div>

          {/* Main Actions - Center */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Primary Action - Format */}
            <button
              onClick={formatJson}
              disabled={!jsonInput.trim()}
              className="header-btn primary"
              style={primaryButtonStyle}
              title="Format JSON (Ctrl+Shift+F)"
            >
              <Zap size={16} />
              <span>Format</span>
            </button>

            <div className="header-divider" />

            {/* File Operations */}
            <button
              onClick={openFile}
              className="header-btn secondary"
              style={secondaryButtonStyle}
              title="Open File (Ctrl+O)"
            >
              <FolderOpen size={16} />
              <span>Open</span>
            </button>

            <button
              onClick={saveFile}
              disabled={!jsonInput.trim()}
              className="header-btn secondary"
              style={{
                ...secondaryButtonStyle,
                color: hasUnsavedChanges && jsonInput.trim() ? '#f59e0b' : secondaryButtonStyle.color,
                cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
                opacity: !jsonInput.trim() ? 0.5 : 1
              }}
              title={hasUnsavedChanges ? 'Save (Ctrl+S)' : 'Download'}
            >
              {hasUnsavedChanges ? <Save size={16} /> : <Download size={16} />}
              <span>{hasUnsavedChanges ? 'Save' : 'Download'}</span>
            </button>

            <div className="header-divider" />

            {/* Tools */}
            <button
              onClick={minifyJson}
              disabled={!isJsonValid}
              className="header-btn secondary"
              style={{
                ...secondaryButtonStyle,
                cursor: !isJsonValid ? 'not-allowed' : 'pointer',
                opacity: !isJsonValid ? 0.5 : 1
              }}
              title="Minify JSON (Ctrl+M)"
            >
              <Minimize2 size={16} />
              <span>Minify</span>
            </button>

            <button
              onClick={clearInput}
              className="header-btn secondary"
              style={secondaryButtonStyle}
              title="Clear All (Ctrl+Shift+C)"
            >
              <RotateCcw size={16} />
              <span>Clear</span>
            </button>

            <button
              onClick={loadSample}
              className="header-btn secondary"
              style={secondaryButtonStyle}
              title="Load Sample (Ctrl+L)"
            >
              <Upload size={16} />
              <span>Sample</span>
            </button>
          </div>

          {/* Right Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* View Mode Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              borderRadius: '8px'
            }}>
              <button
                onClick={() => switchViewMode('editor')}
                style={viewButtonStyle(viewMode === 'editor')}
                title="Editor View"
              >
                <FileText size={16} />
              </button>
              
              <button
                onClick={() => switchViewMode('tree')}
                disabled={!isJsonValid}
                style={{
                  ...viewButtonStyle(viewMode === 'tree'),
                  cursor: !isJsonValid ? 'not-allowed' : 'pointer',
                  opacity: !isJsonValid ? 0.5 : 1
                }}
                title="Tree View"
              >
                <TreePine size={16} />
              </button>
              
              <button
                onClick={() => switchViewMode('compare')}
                style={viewButtonStyle(viewMode === 'compare')}
                title="Compare View"
              >
                <GitCompare size={16} />
              </button>
            </div>

            <div className="header-divider" />

            {/* Utility Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              borderRadius: '8px'
            }}>
              <button
                onClick={toggleSearch}
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: showSearch ? '#3b82f6' : 'transparent',
                  color: showSearch ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Search (Ctrl+K)"
              >
                <Search size={16} />
              </button>

              <button
                onClick={onShowShareModal}
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Share JSON"
              >
                <Share2 size={16} />
              </button>

              <button
                onClick={onShowKeyboardHelp}
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard size={16} />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Settings"
              >
                <Settings size={16} />
              </button>
              
              <button
                onClick={toggleTheme}
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default EnhancedHeader;
