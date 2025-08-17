import React from 'react';
import { X } from 'lucide-react';

const SettingsModal = ({
  showSettings,
  onClose,
  darkMode,
  indentSize,
  setIndentSize,
  loadSample
}) => {
  if (!showSettings) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        minWidth: '400px',
        maxWidth: '500px',
        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
            color: darkMode ? '#f9fafb' : '#111827'
          }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: darkMode ? '#9ca3af' : '#6b7280',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Indent Size Setting */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: darkMode ? '#f3f4f6' : '#374151'
            }}>
              Indent Size
            </label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                borderRadius: '6px',
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#f3f4f6' : '#111827',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>

          {/* Sample Data Button */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: darkMode ? '#f3f4f6' : '#374151'
            }}>
              Sample Data
            </label>
            <button
              onClick={() => {
                loadSample();
                onClose();
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Load Sample JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
