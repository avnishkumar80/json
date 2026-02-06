import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, X } from 'lucide-react';

const CompareSetup = ({ onCompare, darkMode }) => {
    const [leftJson, setLeftJson] = useState('');
    const [rightJson, setRightJson] = useState('');
    const [leftError, setLeftError] = useState('');
    const [rightError, setRightError] = useState('');
    const leftFileRef = useRef(null);
    const rightFileRef = useRef(null);

    const validateAndSet = (value, side) => {
        if (side === 'left') {
            setLeftJson(value);
            try {
                if (value.trim()) JSON.parse(value);
                setLeftError('');
            } catch (e) {
                setLeftError(e.message);
            }
        } else {
            setRightJson(value);
            try {
                if (value.trim()) JSON.parse(value);
                setRightError('');
            } catch (e) {
                setRightError(e.message);
            }
        }
    };

    const handleFileUpload = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                validateAndSet(event.target.result, side);
            };
            reader.readAsText(file);
        }
    };

    const handleCompare = () => {
        if (!leftJson.trim() || !rightJson.trim()) return;
        onCompare(leftJson, rightJson);
    };

    const InputPanel = ({ side, value, error, onChange, fileRef }) => (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '20px',
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '12px',
            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: darkMode ? '#e5e7eb' : '#374151'
                }}>
                    {side === 'left' ? 'Original JSON' : 'Modified JSON'}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => fileRef.current?.click()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            fontSize: '13px',
                            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                            color: darkMode ? '#e5e7eb' : '#374151',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Upload size={14} />
                        Load File
                    </button>
                    {value && (
                        <button
                            onClick={() => validateAndSet('', side)}
                            style={{
                                padding: '6px',
                                backgroundColor: 'transparent',
                                color: darkMode ? '#9ca3af' : '#6b7280',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div style={{ position: 'relative', flex: 1, minHeight: '300px' }}>
                <textarea
                    value={value}
                    onChange={(e) => validateAndSet(e.target.value, side)}
                    placeholder={`Paste ${side === 'left' ? 'original' : 'modified'} JSON here...`}
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '16px',
                        backgroundColor: darkMode ? '#111827' : '#f9fafb',
                        color: darkMode ? '#e5e7eb' : '#111827',
                        border: `1px solid ${error ? '#ef4444' : (darkMode ? '#374151' : '#d1d5db')}`,
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        resize: 'none',
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                {error && (
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        right: '12px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        borderRadius: '6px',
                        fontSize: '12px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        Invalid JSON: {error}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileRef}
                onChange={(e) => handleFileUpload(e, side)}
                accept=".json"
                style={{ display: 'none' }}
            />
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '24px',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: darkMode ? '#f3f4f6' : '#111827'
                }}>
                    Compare JSON
                </h2>
                <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    Paste or load two JSON files to see the differences
                </p>
            </div>

            <div style={{
                display: 'flex',
                gap: '24px',
                flex: 1,
                minHeight: 0
            }}>
                <InputPanel
                    side="left"
                    value={leftJson}
                    error={leftError}
                    onChange={(val) => validateAndSet(val, 'left')}
                    fileRef={leftFileRef}
                />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '1px',
                        height: '100%',
                        backgroundColor: darkMode ? '#374151' : '#e5e7eb'
                    }} />
                </div>

                <InputPanel
                    side="right"
                    value={rightJson}
                    error={rightError}
                    onChange={(val) => validateAndSet(val, 'right')}
                    fileRef={rightFileRef}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                <button
                    onClick={handleCompare}
                    disabled={!leftJson.trim() || !rightJson.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 32px',
                        backgroundColor: (!leftJson.trim() || !rightJson.trim())
                            ? (darkMode ? '#374151' : '#e5e7eb')
                            : '#3b82f6',
                        color: (!leftJson.trim() || !rightJson.trim())
                            ? (darkMode ? '#6b7280' : '#9ca3af')
                            : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (!leftJson.trim() || !rightJson.trim()) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: (!leftJson.trim() || !rightJson.trim())
                            ? 'none'
                            : '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
                    }}
                >
                    Compare JSONs
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default CompareSetup;
