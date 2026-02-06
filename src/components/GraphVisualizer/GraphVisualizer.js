import React from 'react';
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

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: direction === 'LR' ? 'left' : 'top',
            sourcePosition: direction === 'LR' ? 'right' : 'bottom',
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

const processJsonToGraph = (data) => {
    const nodes = [];
    const edges = [];
    let idCounter = 0;

    const traverse = (obj, parentId = null, label = 'root') => {
        const currentId = `n-${idCounter++}`;
        const isObject = typeof obj === 'object' && obj !== null;
        const isArray = Array.isArray(obj);

        let displayLabel = label;
        // let type = 'default';

        // Determine node style/label based on type
        if (isObject) {
            displayLabel = isArray ? `${label} []` : `${label} {}`;
            // type = 'input'; // Just a visual distinction, could be custom node
        } else {
            displayLabel = `${label}: ${String(obj)}`;
            // type = 'output';
        }

        nodes.push({
            id: currentId,
            data: { label: displayLabel },
            position: { x: 0, y: 0 }, // Initial position, will be layouted
            style: {
                background: isObject ? '#3b82f6' : '#10b981',
                color: '#fff',
                border: '1px solid #222',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '12px',
                width: nodeWidth,
            }
        });

        if (parentId) {
            edges.push({
                id: `e-${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                type: 'smoothstep',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
                animated: true,
            });
        }

        if (isObject) {
            Object.entries(obj).forEach(([key, value]) => {
                traverse(value, currentId, key);
            });
        }
    };

    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        traverse(parsed);
    } catch (e) {
        console.error("Failed to parse JSON for graph", e);
        return { nodes: [], edges: [] };
    }

    return getLayoutedElements(nodes, edges);
};

const GraphVisualizer = ({ jsonInput, darkMode }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    React.useEffect(() => {
        if (jsonInput) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = processJsonToGraph(jsonInput);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [jsonInput, setNodes, setEdges]);

    // Update node styles when dark mode changes
    React.useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                style: {
                    ...node.style,
                    background: node.style.background === '#3b82f6' || node.style.background === '#1e40af'
                        ? (darkMode ? '#1e40af' : '#3b82f6') // Object color
                        : (darkMode ? '#059669' : '#10b981'), // Value color
                    borderColor: darkMode ? '#9ca3af' : '#374151',
                    color: '#fff'
                }
            }))
        );
    }, [darkMode, setNodes]);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                minZoom={0.1}
                attributionPosition="bottom-right"
                colorMode={darkMode ? 'dark' : 'light'}
            >
                <Controls />
                <Background color={darkMode ? '#4b5563' : '#aaa'} gap={16} />
            </ReactFlow>
        </div>
    );
};

export default GraphVisualizer;
