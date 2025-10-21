import React from 'react';
import { FileJson2, Upload, Download, Sun, Moon, Settings } from 'lucide-react';

const SimplifiedHeader = ({
  darkMode,
  currentFileName,
  hasUnsavedChanges,
  onOpenFile,
  onSaveFile,
  jsonInput,
  toggleTheme,
  onShowSettings
}) => {
  return (
    <header style={{
      height: '48px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Logo */}
        <FileJson2 size={24} style={{ color: '#3b82f6' }} />
        
        {/* Title and file info */}
        <div>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '14px',
            color: darkMode ? '#f1f5f9' : '#1e293b'
          }}>
            JSON Formatter
          </span>
          {currentFileName && (
            <span style={{
              fontSize: '12px',
              color: darkMode ? '#94a3b8' : '#64748b',
              marginLeft: '8px'
            }}>
              {currentFileName}
              {hasUnsavedChanges && ' •'}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenFile}
          style={{
            padding: '6px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
            borderRadius: '6px',
            color: darkMode ? '#e2e8f0' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Upload size={14} />
          Open
        </button>

        <button
          onClick={onSaveFile}
          disabled={!jsonInput}
          style={{
            padding: '6px 12px',
            backgroundColor: hasUnsavedChanges ? '#3b82f6' : 'transparent',
            border: `1px solid ${hasUnsavedChanges ? '#3b82f6' : darkMode ? '#475569' : '#cbd5e1'}`,
            borderRadius: '6px',
            color: hasUnsavedChanges ? 'white' : darkMode ? '#e2e8f0' : '#475569',
            cursor: jsonInput ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            transition: 'all 0.2s',
            opacity: jsonInput ? 1 : 0.5
          }}
        >
          <Download size={14} />
          Save
        </button>

        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: darkMode ? '#475569' : '#cbd5e1',
          margin: '0 4px'
        }} />

        <button
          onClick={toggleTheme}
          style={{
            padding: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: darkMode ? '#e2e8f0' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onShowSettings}
          style={{
            padding: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: darkMode ? '#e2e8f0' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default SimplifiedHeader;
