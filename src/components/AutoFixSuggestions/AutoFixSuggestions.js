import React from 'react';
import { AlertTriangle, CheckCircle, Wand2, X } from 'lucide-react';

const AutoFixSuggestions = ({ 
  fixes, 
  onApplyFix, 
  onApplyAllFixes, 
  onDismiss, 
  darkMode 
}) => {
  if (!fixes || fixes.length === 0) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#1f2937' : '#fff7ed',
      border: `1px solid ${darkMode ? '#374151' : '#fed7aa'}`,
      borderRadius: '12px',
      padding: '20px',
      margin: '16px 0',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={20} color="#f59e0b" />
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: darkMode ? '#f9fafb' : '#1f2937'
          }}>
            JSON Auto-Fix Suggestions
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {fixes.length > 1 && (
            <button
              onClick={onApplyAllFixes}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Wand2 size={14} />
              Fix All ({fixes.length})
            </button>
          )}
          
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Suggestion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {fixes.map((fix, index) => (
          <div
            key={index}
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
              borderRadius: '8px',
              padding: '16px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              {/* Fix Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>{fix.icon}</span>
                  <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: darkMode ? '#f9fafb' : '#1f2937'
                  }}>
                    {fix.title}
                  </h4>
                  <div style={{
                    padding: '2px 8px',
                    backgroundColor: getSeverityColor(fix.severity),
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {fix.severity}
                  </div>
                </div>
                
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  lineHeight: '1.5'
                }}>
                  {fix.description}
                </p>
                
                {/* Before/After Preview */}
                {fix.before && fix.after && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: '12px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#ef4444',
                        marginBottom: '4px'
                      }}>
                        ❌ Before
                      </div>
                      <pre style={{
                        backgroundColor: darkMode ? '#1f2937' : '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '12px',
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        color: darkMode ? '#fca5a5' : '#dc2626',
                        margin: 0,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {fix.before}
                      </pre>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#10b981',
                        marginBottom: '4px'
                      }}>
                        ✅ After
                      </div>
                      <pre style={{
                        backgroundColor: darkMode ? '#1f2937' : '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '12px',
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        color: darkMode ? '#86efac' : '#16a34a',
                        margin: 0,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {fix.after}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Apply Button */}
              <button
                onClick={() => onApplyFix(fix)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <CheckCircle size={14} />
                Apply Fix
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Tip */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: darkMode ? '#1f2937' : '#f8fafc',
        borderRadius: '8px',
        fontSize: '13px',
        color: darkMode ? '#9ca3af' : '#64748b',
        textAlign: 'center'
      }}>
        💡 <strong>Pro tip:</strong> These fixes are automatically detected. 
        Review before applying to ensure they match your intent.
      </div>
    </div>
  );
};

export default AutoFixSuggestions;
