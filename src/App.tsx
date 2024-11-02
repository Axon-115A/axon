import React, { useCallback, useState } from 'react';
import {
	ReactFlow,
	useNodesState,
	useEdgesState,
	addEdge,
	MiniMap,
	Background,
	SimpleBezierEdge,
	ReactFlowProvider,
	ReactFlowInstance,
	BackgroundVariant,
	getIncomers,
	getOutgoers,
	getConnectedEdges,
	ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { v4 as uuidv4 } from 'uuid';

import { useDisclosure } from '@mantine/hooks';
import { Button, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import CircleNode from './components/CircleNode';
import RectNode from './components/RectNode';
import ContextMenu from './components/ContextMenu';
import NotesWindow from './components/NotesWindow';
import HelpModal from './components/modals/HelpModal';
import ExtendedCanvasControls from './components/ExtendedCanvasControls';

// todo move this elsewhere
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

// todo maybe move these to .env?
const SUPABASE_URL = "https://tugoremjbojyqanvwglz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z29yZW1qYm9qeXFhbnZ3Z2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MTk2ODgsImV4cCI6MjA0Mzk5NTY4OH0.RvmWr4VrQ0ioRR34vpGYeBEz8qFOPh68ZURNf41yhts"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)


const initialNodes: any = [];
const initialEdges: any = [];

const nodeTypes = { 'circle': CircleNode, 'rect': RectNode };
const proOptions = { hideAttribution: true };


export default function App() {
	const [session, setSession] = useState(null)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const [showNotesWindow, setNotesWindowVisibility] = useState(false);
	const [notesWindowNode, setNotesWindowNode] = useState(null);
	const [isMouseOverNode, setMouseOverNode] = useState(false);


	// Context menu state
	const [contextMenu, setContextMenu] = useState({
		isOpen: false,
		anchorX: 0,
		anchorY: 0,
		selectedNodeId: null as string | null
	});

	const [showHelp] = useState(() => {
		// Get value from localStorage if it exists
		const savedVal = localStorage.getItem("showHelp");
		return savedVal || "true";
	})



	const onInit = (instance: ReactFlowInstance) => {
		setReactFlowInstance(instance);
		// console.log(supabase)
	};

	const onConnect = useCallback((params: any) =>
		setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	const onNodesDelete = useCallback(
		(deleted: any) => {
			setEdges(
				deleted.reduce((acc: any, node: any) => {
					const incomers = getIncomers(node, nodes, edges);
					const outgoers = getOutgoers(node, nodes, edges);
					const connectedEdges = getConnectedEdges([node], edges);

					const remainingEdges = acc.filter(
						(edge: any) => !connectedEdges.includes(edge),
					);

					const createdEdges = incomers.flatMap(({ id: source }) =>
						outgoers.map(({ id: target }) => ({
							id: `${source}->${target}`,
							source,
							target,
						})),
					);

					return [...remainingEdges, ...createdEdges];
				}, edges),
			);
		},
		[nodes, edges],
	);

	const [helpOpened, helpHandler] = useDisclosure((showHelp != "false"));

	const handleConfirm = () => {
		// make sure it won't show up in future
		localStorage.setItem('showHelp', "false")
	};

	const handleClose = () => {
		handleConfirm();
		helpHandler.close();
	};

	/* Emma continues here to detect mouse on item. Editing is prompted open if clicked on the node. */
	const onNodeContextMenu = (event: React.MouseEvent, node: any) => {
		event.preventDefault();
		console.log(node)
		/* If clicled over the node, setContextMenu occurs. */
		setContextMenu({
			isOpen: true,
			anchorX: event.clientX,
			anchorY: event.clientY,
			selectedNodeId: node.id
		});
	};

	const onClick = () => {
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

	const onNodeClick = (_event: React.MouseEvent, node: any) => {
		setNotesWindowNode(node);
		setNotesWindowVisibility(true);
	}

	const onShapeChange = () => {
		if (contextMenu.selectedNodeId) {
			setNodes(nodes.map(node => {
				if (node.id === contextMenu.selectedNodeId) {
					return {
						...node,
						type: node.type === 'circle' ? 'rect' : 'circle'
					};
				}
				return node;
			}));
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

	const onEdit = () => {
		if (contextMenu.selectedNodeId) {
			const newLabel = prompt('Enter new label:');
			if (newLabel) {
				setNodes(nodes.map(node => {
					if (node.id === contextMenu.selectedNodeId) {
						return {
							...node,
							data: { ...node.data, label: newLabel }
						};
					}
					return node;
				}));
			}
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

	const onDelete = () => {
		if (contextMenu.selectedNodeId) {
			setNodes(nodes.filter(node => node.id !== contextMenu.selectedNodeId));
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

	const onNodeDelete = () => {
		//for some reason, when a node is deleted, the onNodeMouseLeave callback is not called
		//this leads to a bug where the program thinks the mouse is now perpetually hovering over a node, preventing the user
		//from double clicking to make a new node. 
		//need to manually set this to false when the node is deleted
		setMouseOverNode(false);
		setNotesWindowVisibility(false);
	}

	// const handleDoubleClickEdit = (event: React.MouseEvent, node: any) => {
	// 	// event.preventDefault();
	// 	// console.log(node)
	// 	// setContextMenu(
	// 	// 	prev => ({ ...prev, selectedNodeId: node.id })
	// 	// )
	// 	// console.log(contextMenu)
	// 	// handleEdit()
	// 	console.log(`${node.label} was doubleclicked`);
	// }


	const onDoubleClick = (event: React.MouseEvent) => {
		if (isMouseOverNode) return;

		//convert mouse coordinates to canvas coordinates
		const position = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX - 30,
			y: event.clientY - 30,
		});

		const newNode = {
			// not unique enough
			// id: (nodeID++).toString(),
			id: uuidv4(),
			position: { x: position?.x ?? 0, y: position?.y ?? 0 },
			data: {
				//to add custom data to a node, you need a dictionary called "data" inside data
				//so to access the notes, you need to do `node.data.data.notes`
				//thank you react flow, very cool
				label: "New Node",
				data: {
					notes: ""
				}
			},
			type: 'rect',
		};

		setNodes((nds) => nds.concat(newNode));
	};

	return (
		// why is mantine set to light mode by default?
		<MantineProvider defaultColorScheme="dark">
			<ReactFlowProvider>
				<div style={{ width: '100vw', height: '100vh' }}>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						// todo pls fix	
						// after adding more handles and making them all connectable to each other, this does not properly update connections to the right handle
						// once that is fixed, uncomment this - prasiddh
						// onNodesDelete={onNodesDelete}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						zoomOnDoubleClick={false}
						onDoubleClick={onDoubleClick}
						// this still triggers regular doube click for some reason
						// onNodeDoubleClick={handleDoubleClickEdit}
						onNodeContextMenu={onNodeContextMenu}
						onClick={onClick}
						onNodeClick={onNodeClick}
						edgeTypes={{ simpleBezier: SimpleBezierEdge }}
						onInit={onInit}
						colorMode='dark'
						deleteKeyCode='Delete'
						proOptions={proOptions}
						nodeTypes={nodeTypes}
						connectionMode={ConnectionMode.Loose}
						onNodeMouseEnter={() => { setMouseOverNode(true) }}   //this way, if the mouse is over a node, isMouseOverNode = true
						onNodeMouseLeave={() => { setMouseOverNode(false) }}  //this can be checked in onDoubleClick to prevent placing a new node when double clicking on an existing node
						onNodesDelete={onNodeDelete}
					>

					<MiniMap position="bottom-right" style={{ position: 'absolute', bottom: '0px', right: '30px' }}/>
					<ExtendedCanvasControls 
						clearCanvas={() => { setNodes([]); setEdges([]); setNotesWindowVisibility(false); }} 
						position="bottom-right" 
					/>
					<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
					</ReactFlow>
					<ContextMenu
						isOpen={contextMenu.isOpen}
						setOpen={(open) => setContextMenu(prev => ({ ...prev, isOpen: open }))}
						anchorX={contextMenu.anchorX}
						anchorY={contextMenu.anchorY}
						onShapeChange={onShapeChange}
						onEdit={onEdit}
						onDelete={onDelete}
					/>

					{/* help dialog and button */}
					<HelpModal
						opened={helpOpened}
						onClose = {handleClose}
					/>
					<Button
						variant="filled"
						color="teal"
						onClick={helpHandler.open}
						style={{
							position: 'absolute',
							bottom: '20px',
							left: '50%',  // Center the button horizontally
							transform: 'translateX(-50%)',  // Offset by half of its width to align in center
							fontSize: '16px',
						}}
					>
						Help
					</Button>
				</div>
				{showNotesWindow &&
					<NotesWindow
						node={notesWindowNode}
						onCloseWindow={() => { setNotesWindowVisibility(false) }}
					/>
				}
			</ReactFlowProvider>
		</MantineProvider>
	);
}