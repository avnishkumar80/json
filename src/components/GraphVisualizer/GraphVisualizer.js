import React, { useState } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';

import ObjectNode from './ObjectNode';
import { Menu, RotateCw, PanelLeftClose, PanelLeftOpen, Download } from 'lucide-react';

const nodeWidth = 250; // Increased width for better readability

const nodeTypes = {
    objectNode: ObjectNode,
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

    nodes.forEach((node) => {
        // Estimate height based on properties
        const propCount = node.data.properties ? node.data.properties.length : 0;
        const height = 40 + (propCount * 20) + 20; // Header + properties + padding
        dagreGraph.setNode(node.id, { width: nodeWidth, height: height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const propCount = node.data.properties ? node.data.properties.length : 0;
        const height = 40 + (propCount * 20) + 20;

        return {
            ...node,
            targetPosition: direction === 'LR' ? 'left' : 'top',
            sourcePosition: direction === 'LR' ? 'right' : 'bottom',
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - height / 2,
            },
            data: {
                ...node.data,
                height
            }
        };
    });

    return { nodes: layoutedNodes, edges };
};

const processJsonToGraph = (data, direction = 'LR') => {
    const nodes = [];
    const edges = [];
    let idCounter = 0;

    const traverse = (obj, parentId = null, edgeLabel = '', path = '') => {
        const currentId = `n-${idCounter++}`;
        const isObject = typeof obj === 'object' && obj !== null;
        const isArray = Array.isArray(obj);

        let properties = [];
        let label = edgeLabel || 'Root';

        if (isObject && !isArray) {
            Object.entries(obj).forEach(([key, value]) => {
                const type = value === null ? 'null' : typeof value;
                if (type !== 'object') {
                    // Check for color
                    const isColor = typeof value === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(value);
                    properties.push({ key, value, type, isColor });
                }
            });
        } else if (isArray) {
            label = `${label} [${obj.length}]`;
            // properties.push({ key: 'items', value: obj.length, type: 'number' });
        } else {
            // Primitive root
            label = `${label}`;
            properties.push({ key: 'value', value: String(obj), type: typeof obj });
        }

        nodes.push({
            id: currentId,
            type: 'objectNode',
            data: { label, properties, path },
            position: { x: 0, y: 0 },
        });

        if (parentId) {
            edges.push({
                id: `e-${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                label: edgeLabel,
                type: 'default', // Bezier
                style: { stroke: '#4b5563' },
                labelStyle: { fill: '#9ca3af', fontSize: 11 },
                labelBgStyle: { fill: '#1f2937', fillOpacity: 0.8, rx: 4, ry: 4 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#4b5563',
                },
                animated: false,
            });
        }

        if (isObject) {
            if (isArray) {
                obj.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        const childPath = path ? `${path}.[${index}]` : `[${index}]`;
                        traverse(item, currentId, `[${index}]`, childPath);
                    } else {
                        // Create a primitive node for array items if they are not objects
                        const childPath = path ? `${path}.[${index}]` : `[${index}]`;
                        traverse(item, currentId, `[${index}]`, childPath);
                    }
                });
            } else {
                Object.entries(obj).forEach(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        const childPath = path ? `${path}.${key}` : key;
                        traverse(value, currentId, key, childPath);
                    }
                });
            }
        }
    };

    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        traverse(parsed, null, '', '');
    } catch (e) {
        console.error("Failed to parse JSON for graph", e);
        return { nodes: [], edges: [] };
    }

    return getLayoutedElements(nodes, edges, direction);
};

const GraphVisualizer = ({ jsonInput, darkMode, isSidebarOpen, onToggleSidebar, selectedPath }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [direction, setDirection] = useState('LR');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const rfInstanceRef = React.useRef(null);
    const fitRafRef = React.useRef(null);

    const scheduleFitView = React.useCallback(() => {
        if (!rfInstanceRef.current) return;
        if (fitRafRef.current) cancelAnimationFrame(fitRafRef.current);
        fitRafRef.current = requestAnimationFrame(() => {
            rfInstanceRef.current.fitView({ padding: 0.2, duration: 200 });
        });
    }, []);

    React.useEffect(() => {
        if (jsonInput) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = processJsonToGraph(jsonInput, direction);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [jsonInput, direction, setNodes, setEdges]);

    React.useEffect(() => {
        if (!nodes.length) return;
        scheduleFitView();

        return () => {
            if (fitRafRef.current) cancelAnimationFrame(fitRafRef.current);
        };
    }, [nodes.length, direction, scheduleFitView]);

    React.useEffect(() => {
        if (selectedPath === null || selectedPath === undefined) return;
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    isSelected: node.data.path === selectedPath
                }
            }))
        );

        if (rfInstanceRef.current) {
            const target = rfInstanceRef.current.getNodes().find((n) => n.data?.path === selectedPath);
            if (target) {
                const height = target.data?.height || 80;
                const centerX = target.position.x + (nodeWidth / 2);
                const centerY = target.position.y + (height / 2);
                rfInstanceRef.current.setCenter(centerX, centerY, { zoom: 1.1, duration: 250 });
            }
        }
    }, [selectedPath, nodes.length, setNodes]);

    // Helper to process with direction
    // Modifying processJsonToGraph to accept direction is needed, 
    // or we just call getLayoutedElements inside useEffect if nodes exist?
    // processJsonToGraph calls getLayoutedElements internally. 
    // Let's modify the processJsonToGraph signature to accept direction in the component scope
    // OR create a useEffect that re-layouts existing nodes/edges?
    // Better to re-process cleanly.

    // We need to inject direction into processJsonToGraph.
    // Let's redefine processJsonToGraph inside or pass it.
    // Actually, processJsonToGraph is outside. Let's update it to accept direction.

    // Theme is handled inside ObjectNode via fixed dark colors or we can pass prop if needed. 
    // Reference image is dark mode, so force dark mode styles for now or match prop.
    // The ObjectNode uses fixed dark colors.

    const handleRotate = () => {
        setDirection(prev => prev === 'LR' ? 'TB' : 'LR');
        setIsMenuOpen(false);
    };

    return (
        <div style={{ height: '100%', width: '100%', backgroundColor: '#111827', position: 'relative' }}>
            {/* Floating Menu */}
            <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'row', // Change to row to show buttons side-by-side
                gap: '8px'
            }}>
                {/* Sidebar Toggle Button - Top Level */}
                <button
                    onClick={onToggleSidebar}
                    style={{
                        padding: '8px',
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#f3f4f6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            padding: '8px',
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '6px',
                            color: '#f3f4f6',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Menu size={20} />
                    </button>

                    {isMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            marginTop: '8px',
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            padding: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '180px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            animation: 'fadeIn 0.2s ease',
                            zIndex: 101 // Ensure menu is above other things
                        }}>
                            <button
                                onClick={handleRotate}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    color: '#d1d5db',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    textAlign: 'left'
                                }}
                            >
                                <RotateCw size={16} />
                                Rotate Layout ({direction})
                            </button>

                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    color: '#d1d5db',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    textAlign: 'left',
                                    opacity: 0.5
                                }}
                                disabled
                            >
                                <Download size={16} />
                                Export as Image (Coming Soon)
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onInit={(instance) => {
                    rfInstanceRef.current = instance;
                }}
                minZoom={0.1}
                attributionPosition="bottom-right"
                colorMode="dark"
            >
                <Controls />
                <Background color="#374151" gap={20} size={1} />
            </ReactFlow>
        </div>
    );
};

export default GraphVisualizer;
