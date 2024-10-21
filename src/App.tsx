import React, { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, SimpleBezierEdge, useReactFlow, ReactFlowProvider, ReactFlowInstance, Panel, BackgroundVariant } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import InstructionsBox from './components/instructions';
import CircleNode from './components/CircleNode';
import RectNode from './components/RectNode';

const initialNodes: any = [];
const initialEdges: any = [];
let nodeID = 1;

const nodeTypes = { 'circle': CircleNode, 'rect': RectNode };
const proOptions = { hideAttribution: true };


export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

	const [showHelp, setShowHelp] = useState(() => {
		// Get value from localStorage if it exists
		const savedVal = localStorage.getItem("showHelp");
		return savedVal || "true";
	  })

	const onLoad = (instance: ReactFlowInstance) => {
		setReactFlowInstance(instance);
	};
	
	const onConnect = useCallback((params: any) => 
		setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	const [showInstructions, setShowInstructions] = useState((showHelp != "false"));
	const handleConfirm = () => {
		setShowInstructions(false);
		// make sure it won't show up in future
		localStorage.setItem('showHelp', "false")
	};

	const onDoubleClick = (event: any) => {
		const position = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX - 30,
			y: event.clientY - 30
		});

		const newNode = {
			id: (nodeID++).toString(),
			position: { x: position?.x ?? 0, y: position?.y ?? 0}, //added "?? 0" to silence weird error in nds.concat(newNode)
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
					edgeTypes={{simpleBezier: SimpleBezierEdge}}
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
					{/* help button  */}
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

