import React, { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, SimpleBezierEdge, useReactFlow, ReactFlowProvider, ReactFlowInstance, Panel, BackgroundVariant } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import InstructionsBox from './components/instructions';
import CircleNode from './components/CircleNode';

const initialNodes = [
	{ id: '1', position: { x: 0, y: 0 }, data: { label: 'node 1' } },
	{ id: '2', position: { x: 0, y: 100 }, data: { label: 'node 2' } },
];
const initialEdges: any = [];
let nodeID = 3;

const nodeTypes = { 'circle': CircleNode };
const proOptions = { hideAttribution: true };


export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

	const onLoad = (instance: ReactFlowInstance) => {
		setReactFlowInstance(instance);
	};
	
	const onConnect = useCallback((params: any) => 
		setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	const [showInstructions, setShowInstructions] = useState(true);
	const handleConfirm = () => {
		setShowInstructions(false);
	};

	const onDoubleClick = (event: any) => {
		const position = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX - 30,
			y: event.clientY - 30
		});

		const newNode = {
			id: (nodeID++).toString(),
			position: { x: position?.x, y: position?.y},
			data: { label: "new node" },
			type: 'circle'			
		};

		setNodes((nds) => nds.concat(newNode));
	}

	return (
		<ReactFlowProvider>
			<div style={{ width: '100vw', height: '100vh' }}>
			{showInstructions && <InstructionsBox onConfirm={handleConfirm} />}
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
					colorMode='dark'
					deleteKeyCode='Delete'
					proOptions={proOptions}
					nodeTypes={nodeTypes}
				>
					<MiniMap />
					<Controls />
					<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
				</ReactFlow>
					// help button 
					<button 
						onClick={() => setShowInstructions(true)}
						style={{ 
							position: 'absolute', 
							bottom: '20px', 
							left: 'calc(50% + 12px)',
							transform: 'translateX(-50%)',
							padding: '10px 20px', 
							fontSize: '16px',
							borderRadius: '5px' 
						}}
					>
						Help
					</button>
			</div>
		</ReactFlowProvider>
	);
}

