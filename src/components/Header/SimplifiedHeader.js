import React from 'react';
import {
  FileText,
  Sun,
  Moon,
  Search,
  FolderOpen,
  Download,
  Save,
  Settings,
  TreePine,
  RotateCcw,
  GitCompare,
  FileJson
} from 'lucide-react';

const SimplifiedHeader = ({
  darkMode,
  toggleTheme,
  currentFileName,
  hasUnsavedChanges,
  openFile,
  saveFile,
  jsonInput,
  error,
  viewMode,
  switchViewMode,
  setShowSettings,
  clearInput,
  searchQuery,
  onSearchChange,
  searchResults,
  currentSearchIndex,

  navigateSearch,
  onShowSchemaModal,
  isSchemaValid,
  onGoHome
}) => {
  const isJsonValid = jsonInput.trim() && !error;

  const iconButtonStyle = {
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s'
  };

  const viewButtonStyle = (isActive) => ({
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: isActive
      ? '#10b981'
      : (darkMode ? '#374151' : '#f3f4f6'),
    color: isActive ? '#ffffff' : (darkMode ? '#d1d5db' : '#374151'),
    transition: 'all 0.15s',
    boxShadow: isActive ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
  });

  return (
    <>
      <style>
        {`
          .header-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          .header-btn:active {
            transform: translateY(0);
          }
          .view-btn:hover {
            filter: brightness(1.1);
          }
          .view-btn.active:hover {
            filter: brightness(0.95);
          }
          .search-input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }
          .brand-logo:hover {
            opacity: 0.8;
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
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Brand Section */}
          <div
            onClick={onGoHome}
            className="brand-logo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            title="Go Home"
          >
            <div style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FileText size={20} />
            </div>

            <div>
              <h1 style={{
                fontSize: '18px',
                fontWeight: '700',
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
                  {hasUnsavedChanges && (
                    <span style={{ color: '#f59e0b', fontWeight: '600' }}> • Unsaved</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center - View Mode Selector + Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1,
            justifyContent: 'center'
          }}>
            {/* View Mode Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px',
              backgroundColor: darkMode ? '#111827' : '#e5e7eb',
              borderRadius: '10px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={() => switchViewMode('editor')}
                className={`view-btn ${viewMode === 'editor' ? 'active' : ''}`}
                style={viewButtonStyle(viewMode === 'editor')}
                title="Editor View"
              >
                <FileText size={18} />
                <span>Editor</span>
              </button>

              <button
                onClick={() => switchViewMode('tree')}
                disabled={!isJsonValid}
                className={`view-btn ${viewMode === 'tree' ? 'active' : ''}`}
                style={{
                  ...viewButtonStyle(viewMode === 'tree'),
                  cursor: !isJsonValid ? 'not-allowed' : 'pointer',
                  opacity: !isJsonValid ? 0.4 : 1
                }}
                title={!isJsonValid ? "Valid JSON required" : "Tree View"}
              >
                <TreePine size={18} />
                <span>Tree</span>
              </button>

              <button
                onClick={() => switchViewMode('compare')}
                className={`view-btn ${viewMode === 'compare' ? 'active' : ''}`}
                style={viewButtonStyle(viewMode === 'compare')}
                title="Compare JSON Files"
              >
                <GitCompare size={18} />
                <span>Compare</span>
              </button>
            </div>

            {/* Search Box */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '300px'
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSearchChange(e);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchResults && searchResults.length > 0) {
                        navigateSearch(e.shiftKey ? 'prev' : 'next');
                      }
                    }
                    // Prevent any other key from bubbling
                    if (e.key !== 'Tab') {
                      e.stopPropagation();
                    }
                  }}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                  onInput={(e) => e.stopPropagation()}
                  placeholder="Search keys and values..."
                  className="search-input"
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#f3f4f6' : '#111827',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              {/* Search Results Counter and Navigation */}
              {searchResults && searchResults.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '13px',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    whiteSpace: 'nowrap',
                    fontWeight: '600',
                    padding: '4px 8px',
                    backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
                    borderRadius: '6px'
                  }}>
                    {currentSearchIndex + 1}/{searchResults.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigateSearch('prev');
                    }}
                    style={{
                      ...iconButtonStyle,
                      backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                      color: darkMode ? '#d1d5db' : '#374151',
                      padding: '6px 8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      lineHeight: '1'
                    }}
                    className="header-btn"
                    title="Previous result (Shift+Enter)"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigateSearch('next');
                    }}
                    style={{
                      ...iconButtonStyle,
                      backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                      color: darkMode ? '#d1d5db' : '#374151',
                      padding: '6px 8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      lineHeight: '1'
                    }}
                    className="header-btn"
                    title="Next result (Enter)"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {/* Icon-only buttons */}
            <button
              onClick={openFile}
              className="header-btn"
              style={{
                ...iconButtonStyle,
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: darkMode ? '#d1d5db' : '#374151'
              }}
              title="Open File (Ctrl+O)"
            >
              <FolderOpen size={18} />
            </button>

            <button
              onClick={saveFile}
              disabled={!jsonInput.trim()}
              className="header-btn"
              style={{
                ...iconButtonStyle,
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: hasUnsavedChanges && jsonInput.trim()
                  ? '#f59e0b'
                  : (darkMode ? '#d1d5db' : '#374151'),
                cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
                opacity: !jsonInput.trim() ? 0.5 : 1
              }}
              title={hasUnsavedChanges ? 'Save (Ctrl+S)' : 'Download'}
            >
              {hasUnsavedChanges ? <Save size={18} /> : <Download size={18} />}
            </button>

            <button
              onClick={clearInput}
              className="header-btn"
              style={{
                ...iconButtonStyle,
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: darkMode ? '#d1d5db' : '#374151'
              }}
              title="Clear All (Ctrl+Shift+C)"
            >
              <RotateCcw size={18} />
            </button>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              backgroundColor: darkMode ? '#374151' : '#d1d5db',
              margin: '0 4px'
            }} />

            <button
              onClick={onShowSchemaModal}
              className="header-btn"
              style={{
                ...iconButtonStyle,
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: isSchemaValid ? (darkMode ? '#d1d5db' : '#374151') : (darkMode ? '#f87171' : '#dc2626')
              }}
              title="JSON Schema Validation"
            >
              <FileJson size={18} />
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="header-btn"
              style={{
                ...iconButtonStyle,
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: darkMode ? '#d1d5db' : '#374151'
              }}
              title="Settings & More"
            >
              <Settings size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className="header-btn"
              style={{
                ...iconButtonStyle,
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: darkMode ? '#d1d5db' : '#374151'
              }}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default SimplifiedHeader;