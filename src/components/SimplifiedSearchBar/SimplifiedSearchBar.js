import React, { useState } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

const SimplifiedSearchBar = ({
  darkMode,
  showSearch,
  searchQuery,
  searchResults,
  currentSearchIndex,
  onSearchChange,
  onNavigateSearch,
  onClearSearch,
  onToggleSearch,
  jsonInput
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!jsonInput) return null;

  return (
    <div style={{
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minHeight: '48px',
      transition: 'all 0.3s ease'
    }}>
      {/* Search Icon */}
      <Search size={18} style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />

      {/* Search Input */}
      <div style={{
        flex: 1,
        maxWidth: '400px',
        position: 'relative'
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search JSON..."
          style={{
            width: '100%',
            padding: '6px 32px 6px 12px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
            borderRadius: '6px',
            color: darkMode ? '#f1f5f9' : '#1e293b',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            setIsExpanded(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = darkMode ? '#334155' : '#cbd5e1';
            setTimeout(() => setIsExpanded(false), 200);
          }}
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              color: darkMode ? '#64748b' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && searchResults.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '4px',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`
          }}>
            <span style={{
              fontSize: '12px',
              color: darkMode ? '#94a3b8' : '#64748b',
              fontWeight: '500'
            }}>
              {currentSearchIndex + 1} / {searchResults.length}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => onNavigateSearch('prev')}
              disabled={searchResults.length === 0}
              style={{
                padding: '6px',
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
                borderRadius: '4px',
                color: darkMode ? '#e2e8f0' : '#475569',
                cursor: searchResults.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                opacity: searchResults.length === 0 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (searchResults.length > 0) {
                  e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
              }}
              title="Previous match (Shift+Enter)"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => onNavigateSearch('next')}
              disabled={searchResults.length === 0}
              style={{
                padding: '6px',
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
                borderRadius: '4px',
                color: darkMode ? '#e2e8f0' : '#475569',
                cursor: searchResults.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                opacity: searchResults.length === 0 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (searchResults.length > 0) {
                  e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#ffffff';
              }}
              title="Next match (Enter)"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </>
      )}

      {/* No Results Message */}
      {searchQuery && searchResults.length === 0 && (
        <span style={{
          fontSize: '12px',
          color: darkMode ? '#94a3b8' : '#64748b',
          fontStyle: 'italic'
        }}>
          No results
        </span>
      )}

      {/* Quick Actions - Only show when expanded */}
      {isExpanded && searchQuery && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginLeft: 'auto'
        }}>
          <span style={{
            fontSize: '11px',
            color: darkMode ? '#64748b' : '#94a3b8',
            padding: '4px 8px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '4px',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`
          }}>
            ↵ Next
          </span>
          <span style={{
            fontSize: '11px',
            color: darkMode ? '#64748b' : '#94a3b8',
            padding: '4px 8px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '4px',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`
          }}>
            ⇧↵ Previous
          </span>
          <span style={{
            fontSize: '11px',
            color: darkMode ? '#64748b' : '#94a3b8',
            padding: '4px 8px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '4px',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`
          }}>
            Esc Clear
          </span>
        </div>
      )}
    </div>
  );
};

export default SimplifiedSearchBar;