import React from 'react';
import { FileText, Sun, Moon, Search, Github, Keyboard, Share2 } from 'lucide-react';

const EnhancedHeader = ({
  darkMode,
  toggleTheme,
  toggleSearch,
  showSearch,
  currentFileName,
  hasUnsavedChanges,
  onShowKeyboardHelp,
  onShowShareModal
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      padding: '12px 24px',
      boxShadow: darkMode 
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.2)' 
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Clean Brand Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Minimal Logo */}
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
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              color: darkMode ? '#ffffff' : '#1f2937'
            }}>
              GuidedJSON
            </h1>
            
            {/* File Status - Only show when relevant */}
            {currentFileName && (
              <div style={{
                fontSize: '12px',
                color: darkMode ? '#9ca3af' : '#6b7280',
                marginTop: '2px'
              }}>
                {currentFileName}
                {hasUnsavedChanges && ' • Unsaved'}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* GitHub Star Button */}
          <a
            href="https://github.com/yourusername/json-formatter"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: darkMode ? '#d1d5db' : '#374151',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Star on GitHub"
          >
            <Github size={14} />
            <span>Star</span>
          </a>

          {/* Action Buttons Group */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            borderRadius: '8px'
          }}>
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: showSearch ? '#3b82f6' : 'transparent',
                color: showSearch ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Search JSON (Ctrl+K)"
            >
              <Search size={16} />
            </button>

            {/* Share Button */}
            <button
              onClick={onShowShareModal}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: darkMode ? '#d1d5db' : '#374151',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Share JSON"
            >
              <Share2 size={16} />
            </button>

            {/* Keyboard Help Button */}
            <button
              onClick={onShowKeyboardHelp}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: darkMode ? '#d1d5db' : '#374151',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard size={16} />
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: darkMode ? '#d1d5db' : '#374151',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
