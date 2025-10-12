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
  const buttonBaseStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? '0' : '8px',
    padding: isCollapsed ? '12px' : '10px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    minHeight: isCollapsed ? '44px' : 'auto'
  };

  return (
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
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            color: darkMode ? '#9ca3af' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Core Actions
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Format JSON - Primary action */}
          <button
            onClick={formatJson}
            disabled={!jsonInput.trim()}
            style={{
              ...buttonBaseStyle,
              backgroundColor: !jsonInput.trim() ? 'transparent' : '#10b981',
              color: !jsonInput.trim() ? '#9ca3af' : 'white',
              cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
            }}
            title={isCollapsed ? 'Format JSON' : ''}
            onMouseEnter={(e) => {
              if (jsonInput.trim()) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Zap size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>Format</span>}
          </button>
          
          {/* Open File */}
          <button
            onClick={openFile}
            style={{
              ...buttonBaseStyle,
              color: darkMode ? '#d1d5db' : '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Open File' : ''}
          >
            <FolderOpen size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>Open</span>}
          </button>
          
          {/* Save/Download */}
          <button
            onClick={saveFile}
            disabled={!jsonInput.trim()}
            style={{
              ...buttonBaseStyle,
              color: !jsonInput.trim() 
                ? '#9ca3af' 
                : hasUnsavedChanges
                  ? '#f59e0b'
                  : (darkMode ? '#d1d5db' : '#374151'),
              cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (jsonInput.trim()) {
                e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? (hasUnsavedChanges ? 'Save Changes' : 'Download') : ''}
          >
            {hasUnsavedChanges ? <Save size={isCollapsed ? 20 : 16} /> : <Download size={isCollapsed ? 20 : 16} />}
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
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            color: darkMode ? '#9ca3af' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            View Mode
          </h3>
        )}
        <div style={{
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'row',
          borderRadius: '8px',
          padding: '4px',
          backgroundColor: darkMode ? '#374151' : '#f3f4f6',
          gap: isCollapsed ? '6px' : '4px',
          flexWrap: isCollapsed ? 'nowrap' : 'wrap'
        }}>
          <button
            onClick={() => switchViewMode('editor')}
            style={{
              flex: isCollapsed ? '1' : '1 1 45%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isCollapsed ? '0' : '4px',
              padding: isCollapsed ? '10px 8px' : '6px 8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'editor' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
              color: viewMode === 'editor' ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: isCollapsed ? '40px' : 'auto'
            }}
            title={isCollapsed ? 'Editor View' : ''}
          >
            <FileText size={isCollapsed ? 18 : 14} />
            {!isCollapsed && <span>Editor</span>}
          </button>
          <button
            onClick={() => switchViewMode('tree')}
            disabled={!jsonInput.trim() || !!error}
            style={{
              flex: isCollapsed ? '1' : '1 1 45%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isCollapsed ? '0' : '4px',
              padding: isCollapsed ? '10px 8px' : '6px 8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'tree' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
              color: !jsonInput.trim() || !!error 
                ? '#9ca3af' 
                : viewMode === 'tree' 
                  ? (darkMode ? '#f3f4f6' : '#111827') 
                  : (darkMode ? '#9ca3af' : '#6b7280'),
              fontSize: '13px',
              fontWeight: '500',
              cursor: !jsonInput.trim() || !!error ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              minHeight: isCollapsed ? '40px' : 'auto'
            }}
            title={isCollapsed ? 'Tree View' : ''}
          >
            <TreePine size={isCollapsed ? 18 : 14} />
            {!isCollapsed && <span>Tree</span>}
          </button>
          <button
            onClick={() => switchViewMode('compare')}
            style={{
              flex: isCollapsed ? '1' : '1 1 100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isCollapsed ? '0' : '4px',
              padding: isCollapsed ? '10px 8px' : '6px 8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'compare' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
              color: viewMode === 'compare' ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: isCollapsed ? '40px' : 'auto'
            }}
            title={isCollapsed ? 'Compare View' : ''}
          >
            <GitCompare size={isCollapsed ? 18 : 14} />
            {!isCollapsed && <span>Compare</span>}
          </button>
        </div>
      </div>

      {/* Additional Tools */}
      <div style={{
        padding: isCollapsed ? '16px 8px' : '16px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        {!isCollapsed && (
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            color: darkMode ? '#9ca3af' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Tools
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={minifyJson}
            disabled={!jsonInput.trim()}
            style={{
              ...buttonBaseStyle,
              color: !jsonInput.trim() ? '#9ca3af' : (darkMode ? '#d1d5db' : '#374151'),
              cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (jsonInput.trim()) {
                e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Minify JSON' : ''}
          >
            <Minimize2 size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>Minify</span>}
          </button>
          
          <button
            onClick={clearInput}
            style={{
              ...buttonBaseStyle,
              color: darkMode ? '#d1d5db' : '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Clear All' : ''}
          >
            <RotateCcw size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>Clear</span>}
          </button>
          
          <button
            onClick={loadSample}
            style={{
              ...buttonBaseStyle,
              color: darkMode ? '#d1d5db' : '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Load Sample' : ''}
          >
            <Upload size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>Sample</span>}
          </button>
        </div>
      </div>

      {/* Settings at bottom */}
      <div style={{
        marginTop: 'auto',
        padding: isCollapsed ? '16px 8px' : '16px'
      }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            ...buttonBaseStyle,
            color: darkMode ? '#d1d5db' : '#374151',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
