import React from 'react';
import { FileText, Clipboard, FolderOpen, FileJson, Upload } from 'lucide-react';

const EmptyState = ({
    darkMode,
    onPaste,
    onLoadSample,
    onOpenFile
}) => {
    const cardStyle = {
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '200px',
        textAlign: 'center'
    };

    const iconContainerStyle = {
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: darkMode ? '#374151' : '#f3f4f6',
        color: darkMode ? '#60a5fa' : '#3b82f6',
        marginBottom: '8px'
    };

    const titleStyle = {
        fontSize: '16px',
        fontWeight: '600',
        color: darkMode ? '#f3f4f6' : '#111827',
        margin: 0
    };

    const descStyle = {
        fontSize: '13px',
        color: darkMode ? '#9ca3af' : '#6b7280',
        margin: 0
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '40px',
            height: '100%'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '20px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    marginBottom: '24px',
                    boxShadow: '0 10px 25px -5px rgba(0, 242, 254, 0.4)'
                }}>
                    <FileText size={48} color="white" />
                </div>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: darkMode ? '#f3f4f6' : '#111827',
                    marginBottom: '12px',
                    letterSpacing: '-0.5px'
                }}>
                    Welcome to GuidedJSON
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    maxWidth: '500px',
                    margin: '0 auto',
                    lineHeight: '1.6'
                }}>
                    The advanced JSON editor for professionals. Validate, format, and analyze your JSON with ease.
                </p>
            </div>

            <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {/* Paste Action */}
                <button
                    onClick={onPaste}
                    className="empty-state-card"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div style={iconContainerStyle}>
                        <Clipboard size={32} />
                    </div>
                    <div>
                        <h3 style={titleStyle}>Paste JSON</h3>
                        <p style={descStyle}>From clipboard</p>
                    </div>
                </button>

                {/* Open File Action */}
                <button
                    onClick={onOpenFile}
                    className="empty-state-card"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div style={iconContainerStyle}>
                        <FolderOpen size={32} />
                    </div>
                    <div>
                        <h3 style={titleStyle}>Open File</h3>
                        <p style={descStyle}>Browse computer</p>
                    </div>
                </button>

                {/* Load Sample Action */}
                <button
                    onClick={onLoadSample}
                    className="empty-state-card"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div style={iconContainerStyle}>
                        <FileJson size={32} />
                    </div>
                    <div>
                        <h3 style={titleStyle}>Load Sample</h3>
                        <p style={descStyle}>Try with data</p>
                    </div>
                </button>
            </div>

            <div style={{
                marginTop: '24px',
                padding: '12px 24px',
                borderRadius: '100px',
                backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)',
                border: `1px dashed ${darkMode ? '#4b5563' : '#d1d5db'}`,
                color: darkMode ? '#9ca3af' : '#6b7280',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Upload size={16} />
                <span>Or drag and drop a JSON file anywhere to open</span>
            </div>
        </div>
    );
};

export default EmptyState;
