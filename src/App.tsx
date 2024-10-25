import React, { useCallback, useState } from 'react';
import {
	ReactFlow,
	useNodesState,
	useEdgesState,
	addEdge,
	MiniMap,
	Controls,
	Background,
	SimpleBezierEdge,
	useReactFlow,
	ReactFlowProvider,
	ReactFlowInstance,
	Panel,
	BackgroundVariant,
	getIncomers,
	getOutgoers,
	getConnectedEdges,
	ConnectionMode
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
const nodeStyles = {
	background: "#6c5ce7",
	justifyContent: 'center',
	alignItems: 'center'
}
const proOptions = { hideAttribution: true };


export default function App() {
	const [session, setSession] = useState(null)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const [showNotesWindow, setNotesWindowVisibility] = useState(false);


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



	const onLoad = (instance: ReactFlowInstance) => {
		setReactFlowInstance(instance);
		// console.log(supabase)
	};

	const onConnect = useCallback((params: any) =>
		setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);
	const onNodesDelete = useCallback(
		(deleted) => {
			setEdges(
				deleted.reduce((acc, node) => {
					const incomers = getIncomers(node, nodes, edges);
					const outgoers = getOutgoers(node, nodes, edges);
					const connectedEdges = getConnectedEdges([node], edges);

					const remainingEdges = acc.filter(
						(edge) => !connectedEdges.includes(edge),
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

	/* Emma continues here to detect mouse on item. Editing is prompted open if clicked on the node. */
	const handleContextMenu = (event: React.MouseEvent, node: any) => {
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

	const handlePaneClick = () => {
		setContextMenu(prev => ({ ...prev, isOpen: false }));

		// Remove the bottom-left window if it exists
		if (bottomLeftWindow) {
			bottomLeftWindow.remove();
			bottomLeftWindow = null;
		}
	};

	const handleShapeChange = () => {
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

	const handleEdit = () => {
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

	const handleDelete = () => {
		if (contextMenu.selectedNodeId) {
			setNodes(nodes.filter(node => node.id !== contextMenu.selectedNodeId));
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

	const handleDoubleClickEdit = (event: React.MouseEvent, node: any) => {
		event.preventDefault();
		console.log(node)
		setContextMenu(
			prev => ({ ...prev, selectedNodeId: node.id })
		)
		console.log(contextMenu)
		handleEdit()
	}


	//Emma modified this
	let bottomLeftWindow: HTMLElement | null = null; // Track the bottom left window


	//Emma modified this
	const onDoubleClick = (event: React.MouseEvent) => {
		// Get the mouse position relative to the flow
		const position = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX - 30,
			y: event.clientY - 30,
		});

		// Check if the click was on a node or edge using event.target
		const clickedElement = event.target as HTMLElement;
		const isClickOnNode = clickedElement.closest('.react-flow__node');

		// Remove any existing window before creating a new one
		if (bottomLeftWindow) {
			bottomLeftWindow.remove();
			bottomLeftWindow = null;
		}

		if (!isClickOnNode) {
			// No item clicked, add a new node
			const newNode = {
				// not unique enough
				// id: (nodeID++).toString(),
				id: uuidv4(),
				position: { x: position?.x ?? 0, y: position?.y ?? 0 },
				data: { label: "new node" },
				type: 'rect',
			};

			setNodes((nds) => nds.concat(newNode));


		} else {
			// Item clicked, show window at the bottom left
			showBottomLeftWindow();
		}
	};

	//Emma modified this
	const showBottomLeftWindow = () => {
		// Display a window at the bottom left corner
		bottomLeftWindow = document.createElement('div');
		bottomLeftWindow.style.position = 'absolute';
		bottomLeftWindow.style.bottom = '125px';
		bottomLeftWindow.style.left = '10px';
		bottomLeftWindow.style.width = '200px';
		bottomLeftWindow.style.height = '120px';
		bottomLeftWindow.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Transparent red background
		bottomLeftWindow.style.border = '1px solid #ccc';
		bottomLeftWindow.style.padding = '10px';
		bottomLeftWindow.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)'; // Adds some shadow for a better look

		// Create and add a title element
		const title = document.createElement('h3');
		title.innerText = "new node"; // code has to retrieve the name from the clicked node
		title.style.margin = '0';
		title.style.paddingBottom = '10px';
		title.style.fontSize = '16px';
		title.style.borderBottom = '1px solid #ccc';

		// Add editable content text
		const content = document.createElement('p');

		// Load the saved text from localStorage if available
		const savedText = localStorage.getItem('savedText') || 'You clicked on an item!';
		content.innerText = savedText;

		content.style.margin = '0';
		content.contentEditable = 'true'; // Make the text editable

		// Save the text to localStorage when the content is changed
		content.addEventListener('input', () => {
			localStorage.setItem('savedText', content.innerText);
		});

		// Append title and content to the window
		bottomLeftWindow.appendChild(title);
		bottomLeftWindow.appendChild(content);

		document.body.appendChild(bottomLeftWindow);
	};


	return (
		// why is mantine set to light mode by default?
		<MantineProvider defaultColorScheme="auto">
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
						//onNodeDoubleClick={handleDoubleClickEdit}
						onNodeContextMenu={handleContextMenu}
						onClick={handlePaneClick}
						edgeTypes={{ simpleBezier: SimpleBezierEdge }}
						onInit={onLoad}
						colorMode='dark'
						deleteKeyCode='Delete'
						proOptions={proOptions}
						nodeTypes={nodeTypes}
						connectionMode={ConnectionMode.Loose}
					>
						<MiniMap />
						<Controls />
						<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
					</ReactFlow>
					<ContextMenu
						isOpen={contextMenu.isOpen}
						setOpen={(open) => setContextMenu(prev => ({ ...prev, isOpen: open }))}
						anchorX={contextMenu.anchorX}
						anchorY={contextMenu.anchorY}
						onShapeChange={handleShapeChange}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
					{/* help dialog and button */}
					<HelpModal 
						opened={helpOpened} 
						onClose={helpHandler.close} 
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
							// padding: '10px 20px',
							fontSize: '16px',
							// border: '2px solid #2c2c2c',
						}}
					>
						Help
					</Button>
				</div>
			{showNotesWindow && <NotesWindow nodeName='Node 1 Notes' notes='stuff goes here' onCloseWindow={() => {setNotesWindowVisibility(false); console.log("clicked")}}/>}
			</ReactFlowProvider>
			</MantineProvider>
	);
}

