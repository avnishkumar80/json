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
  FileJson,
  Network
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
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: isActive
      ? (darkMode ? '#374151' : '#ffffff')
      : 'transparent',
    color: isActive
      ? (darkMode ? '#ffffff' : '#111827')
      : (darkMode ? '#9ca3af' : '#6b7280'),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive
      ? (darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)')
      : 'none',
    position: 'relative',
    zIndex: 1
  });

  const podStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px',
    backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
    borderRadius: '12px',
    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
  };

  return (
    <>
      <style>
        {`
          .header-btn:hover {
            transform: translateY(-1px);
            background-color: ${darkMode ? '#4b5563' : '#e5e7eb'} !important;
          }
          .header-btn:active {
            transform: translateY(0);
          }
          .view-btn:hover:not(.active) {
            color: ${darkMode ? '#e5e7eb' : '#374151'} !important;
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
        top: '16px',
        zIndex: 100,
        margin: '0 24px 16px 24px',
        borderRadius: '16px',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: darkMode
          ? '0 4px 24px -4px rgba(0, 0, 0, 0.5)'
          : '0 4px 24px -4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          gap: '24px',
          flexWrap: 'nowrap'
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
            <img
              src={`${process.env.PUBLIC_URL}/icon.svg`}
              alt="GuidedJSON Logo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px'
              }}
            />

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
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
            minWidth: '0' // flex truncate fix
          }}>
            {/* View Mode Segmented Control */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px',
              backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(243, 244, 246, 0.8)',
              borderRadius: '12px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
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

              <button
                onClick={() => switchViewMode('graph')}
                disabled={!isJsonValid}
                className={`view-btn ${viewMode === 'graph' ? 'active' : ''}`}
                style={{
                  ...viewButtonStyle(viewMode === 'graph'),
                  cursor: !isJsonValid ? 'not-allowed' : 'pointer',
                  opacity: !isJsonValid ? 0.4 : 1
                }}
                title={!isJsonValid ? "Valid JSON required" : "Graph View"}
              >
                <Network size={18} />
                <span>Graph</span>
              </button>
            </div>

            {/* Search Box */}
            <div style={{
              position: 'relative',
              minWidth: '300px',
              maxWidth: '400px',
              flex: 1
            }}>
              <Search
                size={16}
                strokeWidth={2.5}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: darkMode ? '#6b7280' : '#9ca3af',
                  pointerEvents: 'none',
                  zIndex: 10
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
                  padding: '10px 16px 10px 42px',
                  paddingRight: searchQuery ? '140px' : '48px',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '999px',
                  backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                  color: darkMode ? '#f3f4f6' : '#111827',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              />

              {/* Keyboard Shortcut Hint (Shows when empty) */}
              {!searchQuery && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px 6px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderRadius: '6px',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  fontSize: '11px',
                  fontWeight: '600',
                  pointerEvents: 'none',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                }}>
                  <span style={{ fontFamily: 'system-ui' }}>⌘ F</span>
                </div>
              )}

              {/* Search Results Counter and Navigation */}
              {searchQuery && (
                <div style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                  zIndex: 10
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: searchResults.length > 0 ? (darkMode ? '#9ca3af' : '#6b7280') : (darkMode ? '#f87171' : '#dc2626'),
                    whiteSpace: 'nowrap',
                    fontWeight: '600',
                    padding: '2px 6px',
                    backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
                    borderRadius: '4px',
                    marginRight: '2px'
                  }}>
                    {searchResults.length > 0
                      ? `${currentSearchIndex + 1}/${searchResults.length}`
                      : 'No results'
                    }
                  </span>

                  {searchResults.length > 0 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigateSearch('prev');
                        }}
                        style={{
                          ...iconButtonStyle,
                          backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                          color: darkMode ? '#d1d5db' : '#374151',
                          padding: '4px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
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
                          padding: '4px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        className="header-btn"
                        title="Next result (Enter)"
                      >
                        ↓
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions - Grouped into Pods */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>

            {/* File Operations Pod */}
            <div style={podStyle}>
              <button
                onClick={openFile}
                className="header-btn"
                style={{
                  ...iconButtonStyle,
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#4b5563'
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
                  backgroundColor: 'transparent',
                  color: hasUnsavedChanges && jsonInput.trim()
                    ? '#f59e0b'
                    : (darkMode ? '#d1d5db' : '#4b5563'),
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
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#4b5563'
                }}
                title="Clear All (Ctrl+Shift+C)"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* Application Settings Pod */}
            <div style={podStyle}>
              <button
                onClick={onShowSchemaModal}
                className="header-btn"
                style={{
                  ...iconButtonStyle,
                  backgroundColor: 'transparent',
                  color: isSchemaValid ? (darkMode ? '#d1d5db' : '#4b5563') : (darkMode ? '#f87171' : '#dc2626')
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
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#4b5563'
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
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#4b5563'
                }}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default SimplifiedHeader;