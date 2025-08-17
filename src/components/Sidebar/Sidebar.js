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
  Upload 
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
  setShowSettings
}) => {
  return (
    <div style={{
      width: '280px',
      borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* File Operations */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0',
          color: darkMode ? '#f3f4f6' : '#111827'
        }}>
          File
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={openFile}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <FolderOpen size={16} />
            <span>Open File</span>
          </button>
          
          <button
            onClick={saveFile}
            disabled={!jsonInput.trim()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: !jsonInput.trim() 
                ? '#9ca3af' 
                : hasUnsavedChanges
                  ? '#f59e0b'
                  : (darkMode ? '#d1d5db' : '#374151'),
              fontSize: '14px',
              fontWeight: '500',
              cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (jsonInput.trim()) {
                e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            {hasUnsavedChanges ? <Save size={16} /> : <Download size={16} />}
            <span>{hasUnsavedChanges ? 'Save Changes' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0',
          color: darkMode ? '#f3f4f6' : '#111827'
        }}>
          View
        </h3>
        <div style={{
          display: 'flex',
          borderRadius: '8px',
          padding: '4px',
          backgroundColor: darkMode ? '#374151' : '#f3f4f6'
        }}>
          <button
            onClick={() => switchViewMode('editor')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'editor' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
              color: viewMode === 'editor' ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <FileText size={16} />
            <span>Editor</span>
          </button>
          <button
            onClick={() => switchViewMode('tree')}
            disabled={!jsonInput.trim() || !!error}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'tree' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
              color: !jsonInput.trim() || !!error 
                ? '#9ca3af' 
                : viewMode === 'tree' 
                  ? (darkMode ? '#f3f4f6' : '#111827') 
                  : (darkMode ? '#9ca3af' : '#6b7280'),
              fontSize: '14px',
              fontWeight: '500',
              cursor: !jsonInput.trim() || !!error ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <TreePine size={16} />
            <span>Tree</span>
          </button>
        </div>
      </div>

      {/* Tools */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0',
          color: darkMode ? '#f3f4f6' : '#111827'
        }}>
          Tools
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={formatJson}
            disabled={!jsonInput.trim()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: !jsonInput.trim() ? 'transparent' : '#10b981',
              color: !jsonInput.trim() ? '#9ca3af' : 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <FileText size={16} />
            <span>Format JSON</span>
          </button>
          
          <button
            onClick={minifyJson}
            disabled={!jsonInput.trim()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: !jsonInput.trim() ? '#9ca3af' : (darkMode ? '#d1d5db' : '#374151'),
              fontSize: '14px',
              fontWeight: '500',
              cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (jsonInput.trim()) {
                e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <Minimize2 size={16} />
            <span>Minify JSON</span>
          </button>
          
          <button
            onClick={clearInput}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <RotateCcw size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Sample Data */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0',
          color: darkMode ? '#f3f4f6' : '#111827'
        }}>
          Sample
        </h3>
        <button
          onClick={loadSample}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: darkMode ? '#d1d5db' : '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <Upload size={16} />
          <span>Load Sample</span>
        </button>
      </div>

      {/* Settings */}
      <div style={{
        padding: '20px'
      }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: darkMode ? '#d1d5db' : '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
