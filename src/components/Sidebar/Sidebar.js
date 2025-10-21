import React from 'react';
import { 
  FolderOpen, 
  Download, 
  Save, 
  FileText, 
  TreePine, 
  RotateCcw, 
  Minimize2,
  Settings,
  Upload,
  ChevronLeft,
  ChevronRight,
  Zap,
  GitCompare
} from 'lucide-react';

const Sidebar = ({
  darkMode,
  openFile,
  saveFile,
  jsonInput,
  hasUnsavedChanges,
  viewMode,
  switchViewMode,
  error,
  formatJson,
  minifyJson,
  clearInput,
  loadSample,
  setShowSettings,
  isCollapsed,
  onToggleCollapse
}) => {
  // Simplified button style - single consistent style
  const getButtonStyle = (isDisabled = false, isActive = false, isPrimary = false) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? '0' : '8px',
    padding: isCollapsed ? '12px' : '10px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive 
      ? (darkMode ? '#374151' : '#e5e7eb')
      : isPrimary && !isDisabled
        ? '#10b981'
        : 'transparent',
    color: isDisabled
      ? '#9ca3af'
      : isPrimary && !isDisabled
        ? '#ffffff'
        : isActive
          ? (darkMode ? '#f3f4f6' : '#111827')
          : (darkMode ? '#d1d5db' : '#374151'),
    fontSize: '14px',
    fontWeight: '500',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: isDisabled ? 0.5 : 1
  });

  const getButtonClass = (isActive = false, isPrimary = false) => {
    const baseClass = 'sidebar-button';
    const classes = [baseClass];
    if (isActive) classes.push('active');
    if (isPrimary) classes.push('primary');
    return classes.join(' ');
  };

  return (
    <>
      <style>
        {`
          .sidebar-button:not(:disabled):hover {
            background-color: ${darkMode ? '#374151' : '#f3f4f6'} !important;
          }
          .sidebar-button.primary:not(:disabled):hover {
            background-color: #059669 !important;
          }
          .sidebar-button.active:hover {
            background-color: ${darkMode ? '#4b5563' : '#d1d5db'} !important;
          }
        `}
      </style>
      <div style={{
      width: isCollapsed ? '70px' : '260px',
      borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: 'absolute',
          top: '16px',
          right: '-12px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#d1d5db' : '#374151',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Core Actions Section */}
      <div style={{
        padding: isCollapsed ? '16px 8px' : '16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        {!isCollapsed && (
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '10px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Actions
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Format JSON - Primary action */}
          <button
            onClick={formatJson}
            disabled={!jsonInput.trim()}
            className={getButtonClass(false, true)}
            style={getButtonStyle(!jsonInput.trim(), false, true)}
            title={isCollapsed ? 'Format JSON' : ''}
          >
            <Zap size={18} />
            {!isCollapsed && <span>Format</span>}
          </button>
          
          {/* Open File */}
          <button
            onClick={openFile}
            className={getButtonClass()}
            style={getButtonStyle()}
            title={isCollapsed ? 'Open File' : ''}
          >
            <FolderOpen size={18} />
            {!isCollapsed && <span>Open</span>}
          </button>
          
          {/* Save/Download */}
          <button
            onClick={saveFile}
            disabled={!jsonInput.trim()}
            className={getButtonClass()}
            style={{
              ...getButtonStyle(!jsonInput.trim()),
              color: hasUnsavedChanges && jsonInput.trim() ? '#f59e0b' : undefined
            }}
            title={isCollapsed ? (hasUnsavedChanges ? 'Save' : 'Download') : ''}
          >
            {hasUnsavedChanges ? <Save size={18} /> : <Download size={18} />}
            {!isCollapsed && <span>{hasUnsavedChanges ? 'Save' : 'Download'}</span>}
          </button>
        </div>
      </div>

      {/* View Mode */}
      <div style={{
        padding: isCollapsed ? '16px 8px' : '16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        {!isCollapsed && (
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '10px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            View
          </h3>
        )}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <button
            onClick={() => switchViewMode('editor')}
            className={getButtonClass(viewMode === 'editor')}
            style={getButtonStyle(false, viewMode === 'editor')}
            title={isCollapsed ? 'Editor' : ''}
          >
            <FileText size={18} />
            {!isCollapsed && <span>Editor</span>}
          </button>
          <button
            onClick={() => switchViewMode('tree')}
            disabled={!jsonInput.trim() || !!error}
            className={getButtonClass(viewMode === 'tree')}
            style={getButtonStyle(!jsonInput.trim() || !!error, viewMode === 'tree')}
            title={isCollapsed ? 'Tree' : ''}
          >
            <TreePine size={18} />
            {!isCollapsed && <span>Tree</span>}
          </button>
          <button
            onClick={() => switchViewMode('compare')}
            className={getButtonClass(viewMode === 'compare')}
            style={getButtonStyle(false, viewMode === 'compare')}
            title={isCollapsed ? 'Compare' : ''}
          >
            <GitCompare size={18} />
            {!isCollapsed && <span>Compare</span>}
          </button>
        </div>
      </div>

      {/* Tools */}
      <div style={{
        padding: isCollapsed ? '16px 8px' : '16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        {!isCollapsed && (
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '10px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Tools
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={minifyJson}
            disabled={!jsonInput.trim()}
            className={getButtonClass()}
            style={getButtonStyle(!jsonInput.trim())}
            title={isCollapsed ? 'Minify' : ''}
          >
            <Minimize2 size={18} />
            {!isCollapsed && <span>Minify</span>}
          </button>
          
          <button
            onClick={clearInput}
            className={getButtonClass()}
            style={getButtonStyle()}
            title={isCollapsed ? 'Clear' : ''}
          >
            <RotateCcw size={18} />
            {!isCollapsed && <span>Clear</span>}
          </button>
          
          <button
            onClick={loadSample}
            className={getButtonClass()}
            style={getButtonStyle()}
            title={isCollapsed ? 'Sample' : ''}
          >
            <Upload size={18} />
            {!isCollapsed && <span>Sample</span>}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div style={{
        marginTop: 'auto',
        padding: isCollapsed ? '16px 8px' : '16px'
      }}>
        <button
          onClick={() => setShowSettings(true)}
          className={getButtonClass()}
          style={getButtonStyle()}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
