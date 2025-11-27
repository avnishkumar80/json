import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, FileJson, Trash2 } from 'lucide-react';

const SchemaValidationModal = ({
    isOpen,
    onClose,
    schemaString,
    onSchemaChange,
    isSchemaValid,
    schemaError,
    darkMode,
    onClearSchema
}) => {
    const [localSchema, setLocalSchema] = useState(schemaString);

    useEffect(() => {
        setLocalSchema(schemaString);
    }, [schemaString]);

    const handleApply = () => {
        onSchemaChange(localSchema);
        if (isSchemaValid || !localSchema.trim()) {
            onClose();
        }
    };

    const handleClear = () => {
        setLocalSchema('');
        onClearSchema();
        onClose();
    };

    if (!isOpen) return null;

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
            zIndex: 1000,
            backdropFilter: 'blur(2px)'
        }}>
            <div style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderRadius: '12px',
                width: '600px',
                maxWidth: '90vw',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            padding: '8px',
                            borderRadius: '8px',
                            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                            color: darkMode ? '#60a5fa' : '#2563eb'
                        }}>
                            <FileJson size={20} />
                        </div>
                        <div>
                            <h2 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '600',
                                color: darkMode ? '#f3f4f6' : '#111827'
                            }}>
                                JSON Schema Validation
                            </h2>
                            <p style={{
                                margin: '4px 0 0 0',
                                fontSize: '13px',
                                color: darkMode ? '#9ca3af' : '#6b7280'
                            }}>
                                Validate your JSON against a schema (Draft 7/2019-09)
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: darkMode ? '#9ca3af' : '#6b7280',
                            padding: '4px'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: '24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: darkMode ? '#d1d5db' : '#374151'
                        }}>
                            Paste JSON Schema
                        </label>
                        {localSchema && (
                            <span style={{
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: isSchemaValid ? (darkMode ? '#34d399' : '#059669') : (darkMode ? '#f87171' : '#dc2626')
                            }}>
                                {isSchemaValid ? <Check size={14} /> : <AlertTriangle size={14} />}
                                {isSchemaValid ? 'Valid Schema Format' : 'Invalid Schema Format'}
                            </span>
                        )}
                    </div>

                    <textarea
                        value={localSchema}
                        onChange={(e) => {
                            setLocalSchema(e.target.value);
                            onSchemaChange(e.target.value);
                        }}
                        placeholder='{"type": "object", "properties": { ... }}'
                        style={{
                            flex: 1,
                            minHeight: '300px',
                            padding: '16px',
                            borderRadius: '8px',
                            border: `1px solid ${!isSchemaValid && localSchema
                                    ? (darkMode ? '#7f1d1d' : '#fca5a5')
                                    : (darkMode ? '#374151' : '#d1d5db')
                                }`,
                            backgroundColor: darkMode ? '#111827' : '#ffffff',
                            color: darkMode ? '#f3f4f6' : '#111827',
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '13px',
                            resize: 'none',
                            outline: 'none'
                        }}
                        spellCheck={false}
                    />

                    {schemaError && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '6px',
                            backgroundColor: darkMode ? '#451a1a' : '#fef2f2',
                            border: `1px solid ${darkMode ? '#7f1d1d' : '#fecaca'}`,
                            color: darkMode ? '#fca5a5' : '#dc2626',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'start',
                            gap: '8px'
                        }}>
                            <AlertTriangle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span>{schemaError}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={handleClear}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: darkMode ? '#ef4444' : '#dc2626',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Trash2 size={16} />
                        Clear Schema
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                                backgroundColor: 'transparent',
                                color: darkMode ? '#d1d5db' : '#374151',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!isSchemaValid && !!localSchema}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: (!isSchemaValid && !!localSchema) ? 'not-allowed' : 'pointer',
                                opacity: (!isSchemaValid && !!localSchema) ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Check size={16} />
                            Apply Validation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemaValidationModal;
