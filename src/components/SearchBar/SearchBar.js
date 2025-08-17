import React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

const SearchBar = ({
  showSearch,
  searchQuery,
  searchResults,
  currentSearchIndex,
  darkMode,
  onSearchChange,
  onNavigateSearch,
  onClearSearch,
  onToggleSearch
}) => {
  if (!showSearch) return null;

  return (
    <div style={{
      borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      padding: '12px 24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px'
      }}>
        <div style={{
          position: 'relative',
          flex: 1
        }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}
          />
          <input
            type="text"
            placeholder="Search JSON..."
            value={searchQuery}
            onChange={onSearchChange}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
              borderRadius: '6px',
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#111827',
              fontSize: '14px',
              outline: 'none'
            }}
            autoFocus
          />
        </div>
        
        {searchResults.length > 0 && (
          <>
            <div style={{
              fontSize: '14px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              whiteSpace: 'nowrap'
            }}>
              {currentSearchIndex + 1} of {searchResults.length}
            </div>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => onNavigateSearch('prev')}
                style={{
                  padding: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.2s'
                }}
                title="Previous result"
              >
                <ChevronUp size={14} />
              </button>
              
              <button
                onClick={() => onNavigateSearch('next')}
                style={{
                  padding: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#d1d5db' : '#374151',
                  transition: 'all 0.2s'
                }}
                title="Next result"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </>
        )}
        
        <button
          onClick={onToggleSearch}
          style={{
            padding: '4px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            color: darkMode ? '#d1d5db' : '#374151',
            transition: 'all 0.2s'
          }}
          title="Close search"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
