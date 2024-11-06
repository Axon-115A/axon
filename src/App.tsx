import React, { useCallback, useEffect, useState } from 'react';
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
	useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// react flow recommends against using their built-in state management, uses zustand to replace it?
// import { useShallow } from 'zustand/react/shallow';

import { v4 as uuidv4 } from 'uuid';

import { useDisclosure } from '@mantine/hooks';
import { Button, Center, Loader, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';

// todo move this elsewhere?
import { createClient, Session } from '@supabase/supabase-js'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'

// custom components
import CircleNode from './components/CircleNode';
import RectNode from './components/RectNode';
import ContextMenu from './components/ContextMenu';
import NotesWindow from './components/NotesWindow';
import HelpModal from './components/modals/HelpModal';
import ClearModal from './components/modals/ClearModal';
import EditLabelModal from './components/modals/EditLabelModal';
import ExtendedCanvasControls from './components/ExtendedCanvasControls';
import SignInModal from "./components/auth/SignIn"
import SignUpModal from './components/auth/SignUp';
import LogOutModal from './components/auth/LogOut';

// todo maybe move these to .env?
const SUPABASE_URL = "https://tugoremjbojyqanvwglz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z29yZW1qYm9qeXFhbnZ3Z2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MTk2ODgsImV4cCI6MjA0Mzk5NTY4OH0.RvmWr4VrQ0ioRR34vpGYeBEz8qFOPh68ZURNf41yhts"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const flowKey = 'axon-flow';



const initialNodes: any = [];
const initialEdges: any = [];


const nodeTypes = { 'circle': CircleNode, 'rect': RectNode };
const proOptions = { hideAttribution: true };




export default function App() {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	// const { setViewport } = useReactFlow();
	const [showNotesWindow, setNotesWindowVisibility] = useState(false);
	const [notesWindowNode, setNotesWindowNode] = useState(null);
	const [isMouseOverNode, setMouseOverNode] = useState(false);
	const [clearModalOpened, setClearModalOpened] = useState(false);
	const [editModalOpened, setEditModalOpened] = useState(false);
	const [currentLabel, setCurrentLabel] = useState("");
	const [signUpOpened, setSignUpOpened] = useState(false);
	const [signInOpened, setSignInOpened] = useState(false);
	const [logOutOpened, setLogOutOpened] = useState(false);

	useEffect(() => {
		const fetchSession = async () => {
		  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
	  
		  if (sessionData?.session) {
			setSession(sessionData.session);
			console.log("retrieved session: ", sessionData)

			// try to get saved json from supabase
			const { data, error } = await supabase
				.from('user_data')
				.select()

			if (error) {
				console.log("failed to retrieve user's nodes", error);
				return;
			}

			console.log(data[0].user_data)
			const flow = data[0].user_data
			console.log(flow.nodes, flow.edges)
			setNodes(flow.nodes || []);
			setEdges(flow.edges || []);



		  } else if (sessionError) {
			console.log("Error when retrieving session:", sessionError);
		  } else {
			const flow = JSON.parse(localStorage.getItem(flowKey) ?? "");
			console.log("no session, restoring state from local storage: ", flow)
			if (flow) {
				// const { x = 0, y = 0, zoom = 1 } = flow.viewport;
				console.log(flow.nodes, flow.edges)
				setNodes(flow.nodes || []);
				setEdges(flow.edges || []);
				// setViewport({ x, y, zoom });
			}
		  }
	  
		  // Set loading to false after fetching session
		  setLoading(false);
		};
	  
		fetchSession();
	}, []);


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

	const handleSignUp = async (email: string, password: string) => {
		console.log(`Signing up with email: ${email}, password: ${password}`);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error('Error signing up:', error.message);
			return;
		}

		console.log('Sign up successful:', data);
		setSession(data.session);

		setSignUpOpened(false);
	};

	const handleSignIn = async (email: string, password: string) => {
		// Perform sign-in actions (e.g., authenticate with Supabase)
		console.log(`Signing in with email: ${email}, password: ${password}`);

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			console.error('Error signing in:', error.message);
			return;
		}

		console.log('Sign in successful:', data);
		setSession(data.session);

		setSignInOpened(false);
	};

	const handleLogOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Error signing out:', error.message); else setSession(null);
	};

	const handleSaveState = async () => {

		if (reactFlowInstance == null) {
			console.log("React flow instance null, nothing to save");
			return;
		}

		const flow = reactFlowInstance.toObject()

		if (session == null) {
			console.log("User is not signed in, saving to local storage");
			localStorage.setItem(flowKey, JSON.stringify(flow));
			return;
		}

		const { data, error } = await supabase
			.from('user_data')
			.upsert({ user_id: session.user.id, user_data: flow})
			.select()
		if (data) {
			console.log("successfully saved state", data)
		} else if (error) {
			console.log("failed to save state", error)
		}
	} 


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
			const selectedNode = nodes.find(node => node.id === contextMenu.selectedNodeId);
			if (selectedNode) {
				setCurrentLabel(selectedNode.data.label as string);
				setEditModalOpened(true);
			}
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

	const handleLabelChange = (newLabel: string) => {
		setNodes(nodes.map(node => {
			if (node.id === contextMenu.selectedNodeId) {
				return {
					...node,
					data: { ...node.data, label: newLabel }
				};
			}
			return node;
		}));
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
	//  // event.preventDefault();
	//  // console.log(node)
	//  // setContextMenu(
	//  //  prev => ({ ...prev, selectedNodeId: node.id })
	//  // )
	//  // console.log(contextMenu)
	//  // handleEdit()
	//  console.log(`${node.label} was doubleclicked`);
	// }


	// Emma added the text limit in this function block

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
				},
			},
			type: 'rect',
		};

		setNodes((nds) => nds.concat(newNode));
	};

	// clearing the canvas and closing notes window
	const handleClearCanvas = () => {
		setNodes([]);
		setEdges([]);
		setNotesWindowVisibility(false);
		
		// Run handleSaveState after ensuring nodes and edges are updated
		setTimeout(handleSaveState, 0);

	};

	if (loading) {
		return (
			<MantineProvider defaultColorScheme="dark">
				<Center style={{ width: '100vw', height: '100vh' }}>
					<Loader color="blue" size={'lg'} type="dots"/>
				</Center>
			</MantineProvider>
		)
	}

	return (
		// why is mantine set to light mode by default?
		<MantineProvider defaultColorScheme="dark">
			<ModalsProvider>
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
							connectionRadius={35} //the min distance an edge has to be dragged close to a handle before it snaps to it. default is 20
						>

						<MiniMap position="bottom-right" style={{ position: 'absolute', bottom: '0px', right: '30px' }} />
						<ExtendedCanvasControls
							clearCanvas={() => setClearModalOpened(true)}
							position="bottom-right"
							saveCanvas={() => {handleSaveState()}} //empty placeholder to silence typescript error
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

						<EditLabelModal
							opened={editModalOpened}
							label={currentLabel}
							onClose={() => setEditModalOpened(false)}
							onConfirm={handleLabelChange}
						/>

						{/* help dialog and button */}
						<HelpModal
							opened={helpOpened}
							onClose={handleClose}
						/>
						<ClearModal
							opened={clearModalOpened}
							onClose={() => setClearModalOpened(false)}
							onConfirm={handleClearCanvas}
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
						<div
							style={{
								position: "absolute",
								top: "10px",
								right: "10px",
								display: "flex",
								gap: "10px"
							}}
						>
							
							{session ? (
								<Button onClick={() => setLogOutOpened(true)}>
									Log Out
								</Button>
							) : (
								<>
								<Button onClick={() => setSignUpOpened(true)}>
									Sign Up
								</Button>

								<Button onClick={() => setSignInOpened(true)}>
									Sign In
								</Button>
								</>
							)}

							
						</div>

						<SignUpModal
							opened={signUpOpened}
							onClose={() => setSignUpOpened(false)}
							onConfirm={handleSignUp}
						/>

						<SignInModal
							opened={signInOpened}
							onClose={() => setSignInOpened(false)}
							onConfirm={handleSignIn}
						/>
						
						<LogOutModal
							opened={logOutOpened}
							onClose={() => setLogOutOpened(false)}
							onConfirm={handleLogOut}
						/>

					</div>
					{showNotesWindow &&
						<NotesWindow
							node={notesWindowNode}
							onCloseWindow={() => { setNotesWindowVisibility(false) }}
						/>
					}
				</ReactFlowProvider>
			</ModalsProvider>
		</MantineProvider>
	);
}

