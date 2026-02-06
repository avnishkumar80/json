import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

const StatusBar = ({
    darkMode,
    cursorPosition = { line: 1, col: 1 },
    jsonSize = 0,
    isSchemaValid,
    indentSize,
    onIndentChange
}) => {
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 8px',
        fontSize: '12px',
        color: darkMode ? '#9ca3af' : '#4b5563',
        cursor: 'default'
    };

    return (
        <div style={{
            height: '24px',
            backgroundColor: darkMode ? '#1f2937' : '#007acc', // VS Code blue for light mode
            color: darkMode ? '#d1d5db' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '12px',
            userSelect: 'none',
            zIndex: 50
        }}>
            {/* Left Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={itemStyle}>
                    <span style={{ color: darkMode ? '#d1d5db' : '#ffffff' }}>
                        Ln {cursorPosition.line}, Col {cursorPosition.col}
                    </span>
                </div>

                <div style={itemStyle}>
                    <span style={{ color: darkMode ? '#d1d5db' : '#ffffff' }}>
                        {formatSize(jsonSize)}
                    </span>
                </div>
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    ...itemStyle,
                    cursor: 'pointer',
                    color: darkMode ? '#d1d5db' : '#ffffff'
                }}
                    onClick={() => {
                        const newSize = indentSize === 2 ? 4 : 2;
                        onIndentChange && onIndentChange(newSize);
                    }}
                    title="Click to toggle indentation"
                >
                    <span>Spaces: {indentSize}</span>
                </div>

                <div style={{
                    ...itemStyle,
                    color: darkMode ? '#d1d5db' : '#ffffff'
                }}>
                    <span>UTF-8</span>
                </div>

                <div style={{
                    ...itemStyle,
                    color: darkMode ? '#d1d5db' : '#ffffff'
                }}>
                    <span>JSON</span>
                </div>

                {isSchemaValid !== undefined && (
                    <div style={{
                        ...itemStyle,
                        color: isSchemaValid ? (darkMode ? '#34d399' : '#4ade80') : (darkMode ? '#f87171' : '#f87171')
                    }}>
                        {isSchemaValid ? <Check size={12} /> : <AlertCircle size={12} />}
                        <span>{isSchemaValid ? 'Schema Valid' : 'Schema Invalid'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusBar;
