import React from 'react';
import { FileText, Sun, Moon, Search, Github, Star, Zap } from 'lucide-react';

const EnhancedHeader = ({
  darkMode,
  toggleTheme,
  toggleSearch,
  showSearch,
  currentFileName,
  hasUnsavedChanges
}) => {
  return (
    <header style={{
      borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      padding: '16px 24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Enhanced Logo */}
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
            }}>
              <FileText size={24} />
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  margin: 0,
                  color: darkMode ? '#ffffff' : '#1e40af',
                  textShadow: darkMode ? '0 0 10px rgba(79, 172, 254, 0.5)' : 'none'
                }}>
                  GuidedJSON
                </h1>
                
                {/* Beta Badge */}
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  Pro
                </div>
              </div>
              
              <p style={{
                fontSize: '13px',
                color: darkMode ? '#9ca3af' : '#6b7280',
                margin: '2px 0 0 0',
                fontWeight: '500'
              }}>
                The Developer's JSON Tool
              </p>
              
              {currentFileName && (
                <p style={{
                  fontSize: '12px',
                  color: darkMode ? '#60a5fa' : '#3b82f6',
                  margin: '2px 0 0 0',
                  fontWeight: '500'
                }}>
                  📄 {currentFileName}
                  {hasUnsavedChanges && ' • Unsaved changes'}
                </p>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginLeft: '24px',
            fontSize: '12px',
            color: darkMode ? '#9ca3af' : '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} style={{ color: '#fbbf24' }} />
              <span>50K+ users</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} style={{ color: '#10b981' }} />
              <span>100% secure</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* GitHub Button */}
          <a
            href="https://github.com/your-repo/guidedjson"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              textDecoration: 'none',
              color: darkMode ? '#d1d5db' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              backgroundColor: 'transparent'
            }}
          >
            <Github size={16} />
            <span>Star</span>
          </a>

          {/* Search Button */}
          <button
            onClick={toggleSearch}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: showSearch ? '#3b82f6' : (darkMode ? '#374151' : '#f3f4f6'),
              color: showSearch ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Search JSON (Ctrl+F)"
          >
            <Search size={16} />
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
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
    </header>
  );
};

export default EnhancedHeader;