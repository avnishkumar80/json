import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const colors = {
    string: '#93c5fd', // blue-300
    number: '#fdba74', // orange-300
    boolean: '#fca5a5', // red-300
    null: '#d8b4fe',   // purple-300
    key: '#e5e7eb',    // gray-200
};


const ObjectNode = ({ data, isConnectable }) => {
    const { label, properties = [], isSelected } = data;

    return (
        <div style={{
            background: '#1f2937', // gray-800
            color: '#f3f4f6',      // gray-100
            borderRadius: '8px',
            border: isSelected ? '2px solid #60a5fa' : '1px solid #374151', // gray-700
            minWidth: '200px',
            fontSize: '12px',
            fontFamily: 'monospace',
            boxShadow: isSelected
                ? '0 0 0 3px rgba(59, 130, 246, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.4)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ background: '#6b7280', width: '8px', height: '8px' }}
            />

            {/* Header / Title */}
            {/* If label is just a key name, show it. If it's root, show 'Root' or similar */}
            {label && (
                <div style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #374151', // gray-700
                    fontWeight: 'bold',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    color: '#d1d5db' // gray-300
                }}>
                    {label}
                </div>
            )}

            {/* Properties List */}
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {properties.map((prop, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: colors.key }}>{prop.key}:</span>

                        {/* Value Display */}
                        <span style={{
                            color: colors[prop.type] || '#fff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            {prop.isColor && (
                                <span style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: prop.value,
                                    border: '1px solid #fff'
                                }} />
                            )}
                            {String(prop.value)}
                        </span>
                    </div>
                ))}
                {properties.length === 0 && (
                    <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        (empty)
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                style={{ background: '#6b7280', width: '8px', height: '8px' }}
            />
        </div>
    );
};

export default memo(ObjectNode);
