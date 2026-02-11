import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, ArrowRightLeft } from 'lucide-react';
import JsonEditor from '../JsonEditor/JsonEditor';

const CompareSetup = ({ onCompare, darkMode, currentInput }) => {
    const [leftJson, setLeftJson] = useState(currentInput || '');
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

    const handleSwap = () => {
        const tempJson = leftJson;
        const tempError = leftError;
        setLeftJson(rightJson);
        setLeftError(rightError);
        setRightJson(tempJson);
        setRightError(tempError);
    };

    const canCompare = leftJson.trim() && rightJson.trim() && !leftError && !rightError;

    const InputPanel = ({ side, value, error, fileRef }) => {
        const hasValue = Boolean(value && value.trim());
        const isValid = hasValue && !error;
        const statusLabel = hasValue ? (isValid ? 'Valid JSON' : 'Invalid JSON') : 'Empty';

        return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '8px',
            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 12px 0 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: darkMode ? '#9ca3af' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {side === 'left' ? 'Original' : 'Modified'}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: !hasValue ? (darkMode ? '#111827' : '#f3f4f6') : (isValid ? (darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7') : (darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2')),
                        color: !hasValue ? (darkMode ? '#9ca3af' : '#6b7280') : (isValid ? (darkMode ? '#86efac' : '#15803d') : (darkMode ? '#fca5a5' : '#b91c1c')),
                        border: `1px solid ${!hasValue ? (darkMode ? '#1f2937' : '#e5e7eb') : (isValid ? (darkMode ? 'rgba(34,197,94,0.4)' : '#86efac') : (darkMode ? 'rgba(239,68,68,0.4)' : '#fca5a5'))}`
                    }}>
                        {statusLabel}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => fileRef.current?.click()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                            color: darkMode ? '#e5e7eb' : '#374151',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Upload size={14} />
                        Load file
                    </button>
                    {value && (
                        <button
                            onClick={() => validateAndSet('', side)}
                            style={{
                                padding: '6px 10px',
                                backgroundColor: darkMode ? '#111827' : '#f9fafb',
                                color: darkMode ? '#9ca3af' : '#6b7280',
                                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div style={{ position: 'relative', flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, position: 'relative', border: `1px solid ${error ? '#ef4444' : (darkMode ? '#374151' : '#e5e7eb')}`, borderRadius: '8px', overflow: 'hidden' }}>
                    <JsonEditor
                        jsonInput={value}
                        darkMode={darkMode}
                        onInputChange={(e) => validateAndSet(e.target.value, side)}
                        error={null} // We handle error display separately below to match design
                    />
                    {!hasValue && (
                        <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            color: darkMode ? '#6b7280' : '#9ca3af',
                            fontSize: '12px',
                            pointerEvents: 'none'
                        }}>
                            Paste JSON or load a file to compare.
                        </div>
                    )}
                </div>
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
                        backdropFilter: 'blur(4px)',
                        zIndex: 20, // Ensure detailed error is above editor
                        pointerEvents: 'none'
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
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px',
            gap: '16px',
            maxWidth: '100%',
            margin: '0',
            width: '100%'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 4px 0 4px'
            }}>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#f3f4f6' : '#111827' }}>
                        Compare JSON
                    </div>
                    <div style={{ fontSize: '13px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                        Paste or load two JSON documents to see differences.
                    </div>
                </div>
                <button
                    onClick={handleCompare}
                    disabled={!canCompare}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        backgroundColor: canCompare ? '#2563eb' : (darkMode ? '#374151' : '#e5e7eb'),
                        color: canCompare ? '#ffffff' : (darkMode ? '#6b7280' : '#9ca3af'),
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: canCompare ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        boxShadow: canCompare ? '0 4px 8px -2px rgba(37, 99, 235, 0.45)' : 'none'
                    }}
                >
                    Compare
                    <ArrowRight size={16} />
                </button>
            </div>

            <div style={{
                display: 'flex',
                gap: '16px',
                flex: 1,
                minHeight: 0
            }}>
                <InputPanel
                    side="left"
                    value={leftJson}
                    error={leftError}
                    fileRef={leftFileRef}
                />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    width: '32px'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '50%',
                        width: '1px',
                        backgroundColor: darkMode ? '#374151' : '#e5e7eb',
                        transform: 'translateX(-50%)'
                    }} />

                    <button
                        onClick={handleSwap}
                        title="Swap (Switch sides)"
                        style={{
                            position: 'relative',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            color: darkMode ? '#e5e7eb' : '#374151',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.borderColor = darkMode ? '#60a5fa' : '#3b82f6';
                            e.currentTarget.style.color = darkMode ? '#60a5fa' : '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = darkMode ? '#4b5563' : '#d1d5db';
                            e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#374151';
                        }}
                    >
                        <ArrowRightLeft size={16} />
                    </button>
                </div>

                <InputPanel
                    side="right"
                    value={rightJson}
                    error={rightError}
                    fileRef={rightFileRef}
                />
            </div>
        </div>
    );
};

export default CompareSetup;
