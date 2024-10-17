import React, { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, SimpleBezierEdge, useReactFlow, ReactFlowProvider, ReactFlowInstance } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
	{ id: '1', position: { x: 0, y: 0 }, data: { label: 'node 1' } },
	{ id: '2', position: { x: 0, y: 100 }, data: { label: 'node 2' } },
];
const initialEdges: any = [];

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

	const onLoad = (instance: ReactFlowInstance) => {
		console.log("loaded")
		setReactFlowInstance(instance);
	};

	const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	const onDoubleClick = (event: any) => {
		const position = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		const newNode = {
			id: Math.round(Math.random() * 1000).toString(),
			position: { x: position?.x, y: position?.y},
			data: { label: "new node" }
		};


		setNodes((nds) => nds.concat(newNode));
	}

	return (
		<ReactFlowProvider>
			<div style={{ width: '100vw', height: '100vh' }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					zoomOnDoubleClick={false}
					onDoubleClick={onDoubleClick}
					edgeTypes={SimpleBezierEdge}
					onInit={onLoad}
				>

					<MiniMap />
					<Controls />
					<Background variant="dots" gap={12} size={1} />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
}