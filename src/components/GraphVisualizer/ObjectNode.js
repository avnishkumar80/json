import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { vscodeDark, vscodeTokens } from '../../utils/vscodeTheme';

const colors = {
    string: vscodeTokens.string,
    number: vscodeTokens.number,
    boolean: vscodeTokens.boolean,
    null: vscodeTokens.null,
    key: vscodeTokens.key,
};


const ObjectNode = ({ data, isConnectable }) => {
    const { label, properties = [], isSelected, useVscodeTheme } = data;
    const useVscodeDark = Boolean(useVscodeTheme);
    const classicColors = {
        string: '#93c5fd',
        number: '#fdba74',
        boolean: '#fca5a5',
        null: '#d8b4fe',
        key: '#e5e7eb'
    };

    return (
        <div style={{
            background: useVscodeDark ? vscodeDark.panel : '#1f2937',
            color: useVscodeDark ? vscodeDark.text : '#f3f4f6',
            borderRadius: '8px',
            border: isSelected ? `2px solid ${useVscodeDark ? vscodeDark.accent : '#60a5fa'}` : `1px solid ${useVscodeDark ? vscodeDark.border : '#374151'}`,
            minWidth: '200px',
            fontSize: '12px',
            fontFamily: useVscodeDark ? '"JetBrains Mono", "Fira Code", "Consolas", monospace' : 'monospace',
            boxShadow: isSelected
                ? (useVscodeDark ? '0 0 0 3px rgba(0, 122, 204, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.4)' : '0 0 0 3px rgba(96, 165, 250, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.4)')
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ background: useVscodeDark ? vscodeDark.muted : '#6b7280', width: '8px', height: '8px' }}
            />

            {/* Header / Title */}
            {/* If label is just a key name, show it. If it's root, show 'Root' or similar */}
            {label && (
                <div style={{
                    padding: '8px 12px',
                    borderBottom: `1px solid ${useVscodeDark ? vscodeDark.border : '#374151'}`,
                    fontWeight: 'bold',
                    background: useVscodeDark ? vscodeDark.panelAlt : 'rgba(255, 255, 255, 0.05)',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    color: useVscodeDark ? vscodeDark.text : '#d1d5db'
                }}>
                    {label}
                </div>
            )}

            {/* Properties List */}
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {properties.map((prop, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: useVscodeDark ? colors.key : classicColors.key }}>{prop.key}:</span>

                        {/* Value Display */}
                        <span style={{
                            color: useVscodeDark ? (colors[prop.type] || '#fff') : (classicColors[prop.type] || '#fff'),
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
                                    border: `1px solid ${useVscodeDark ? vscodeDark.text : '#fff'}`
                                }} />
                            )}
                            {String(prop.value)}
                        </span>
                    </div>
                ))}
                {properties.length === 0 && (
                    <div style={{ color: useVscodeDark ? vscodeDark.muted : '#6b7280', fontStyle: 'italic' }}>
                        (empty)
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                style={{ background: useVscodeDark ? vscodeDark.muted : '#6b7280', width: '8px', height: '8px' }}
            />
        </div>
    );
};

export default memo(ObjectNode);
