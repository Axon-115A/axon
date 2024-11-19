import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
	ReactFlow,
	useNodesState,
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
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

// todo move this elsewhere?
import { createClient, Provider, Session } from '@supabase/supabase-js'
import debounce from 'lodash.debounce';

// custom components
import { Connection, Edge } from 'reactflow';
import { useEdgesState } from '@xyflow/react';
import CustomEdge from './components/CustomEdge';
import EdgeContextMenu from './components/EdgeContextMenu';
import CircleNode from './components/CircleNode';
import RectNode from './components/RectNode';
import ContextMenu from './components/ContextMenu';
import NotesWindow from './components/NotesWindow';
import NotesWindowMantine from './components/NotesWindowMantine';
import HelpModal from './components/modals/HelpModal';
import ClearModal from './components/modals/ClearModal';
import EditLabelModal from './components/modals/EditLabelModal';
import ExtendedCanvasControls from './components/ExtendedCanvasControls';
import SignInModal from "./components/auth/SignIn"
import SignUpModal from './components/auth/SignUp';
import LogOutModal from './components/auth/LogOut';
import NodeList from './components/NodeList';
import ColorPickerModal from './components/modals/ColorPickerModal';

// todo maybe move these to .env?
const SUPABASE_URL = "https://tugoremjbojyqanvwglz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z29yZW1qYm9qeXFhbnZ3Z2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MTk2ODgsImV4cCI6MjA0Mzk5NTY4OH0.RvmWr4VrQ0ioRR34vpGYeBEz8qFOPh68ZURNf41yhts"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const flowKey = 'axon-flow';



const initialNodes: any = [];
// const initialEdges: any = [];


const nodeTypes = { 'circle': CircleNode, 'rect': RectNode };
const proOptions = { hideAttribution: true };


// S: imports needed for edge customizations
const edgeTypes = {
	'custom-edge': CustomEdge,
};
export type CustomEdge = Edge & {
	data: {
		color: string;
	};
}

const initialEdges = [] as CustomEdge[];


export default function App() {

	// return (
	// 	<Auth
	// 		supabaseClient={supabase}
	// 		appearance={{ theme: ThemeSupa }}
	// 	/>
	// )
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const [showNotesWindow, setNotesWindowVisibility] = useState(false);
	const [notesWindowNode, setNotesWindowNode] = useState(null);
	const [isMouseOverNode, setMouseOverNode] = useState(false);
	const [clearModalOpened, setClearModalOpened] = useState(false);
	const [editModalOpened, setEditModalOpened] = useState(false);
	const [currentLabel, setCurrentLabel] = useState("");
	const [signUpOpened, setSignUpOpened] = useState(false);
	const [signInOpened, setSignInOpened] = useState(false);
	const [logOutOpened, setLogOutOpened] = useState(false);
	const [selectedColor, setSelectedColor] = useState('#ffffff');
	const [colorModalOpened, setColorModalOpened] = useState(false);

	//S: assigns a boolean on whether something is a Node or Edge, useful for color picker 
	const [colorModalIsNode, setColorModalIsNode] = useState(true);



	const defaultViewport = {
		"x": 0,
		"y": 0,
		"zoom": 1
	}

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
					.eq('user_id', sessionData.session.user.id)
					.limit(1)
					.single()


				if (error) {
					console.log("failed to retrieve user's nodes", error);
					if (error.code === "406" || error.code === "PGRST116") {
						// add new row for user if it doesn't exist
						console.log("user has no rows in database, adding empty row, or localstorage if it exists", console.log(localStorage.getItem(flowKey)))
						const { data, error } = await supabase
							.from('user_data')
							.upsert({ user_id: sessionData.session.user.id, user_data: JSON.parse(localStorage.getItem(flowKey) ?? "{}") })
							.select()

						// clear user's local storage after it's copied so it doesn't show up after they log out
						if (localStorage.getItem(flowKey)) {
							localStorage.removeItem(flowKey)
						}
						if (error) {
							notifications.show({
								title: 'Error Fetching Session',
								message: error.message,
								color: 'red',
							});
						} else {
							console.log("retrieved: ", data)
						}
					} else {
						notifications.show({
							title: 'Error Fetching Session',
							message: error.message,
							color: 'red',
						});
						return;
					}
				}

				if (data != null) {
					console.log(data.user_data)
					const flow = data.user_data
					console.log(flow, flow.nodes, flow.edges)
					setNodes(flow.nodes || []);
					setEdges(flow.edges || []);
					if (reactFlowInstance) {
						reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
					}
				}




			} else if (sessionError) {
				console.log("Error when retrieving session:", sessionError);
			} else {
				const flowJson = localStorage.getItem(flowKey);
				if (flowJson != null) {
					const flow = JSON.parse(flowJson);
					console.log("no session, restoring state from local storage: ", flow)
					if (flow) {
						// const { x = 0, y = 0, zoom = 1 } = flow.viewport;
						console.log(flow.nodes, flow.edges)
						setNodes(flow.nodes || []);
						setEdges(flow.edges || []);
						if (reactFlowInstance) {
							reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
						}
						// setViewport({ x, y, zoom });
					}
				}

			}

			// Set loading to false after fetching session
			setLoading(false);
		};

		fetchSession();
	}, []);

	// useEffect(() => {
	// 	// This callback will fire whenever nodes or edges change
	// 	console.log('Nodes or edges have changed:', nodes, edges);
	//   }, [nodes, edges]);	


	// Context menu state
	const [contextMenu, setContextMenu] = useState({
		isOpen: false,
		anchorX: 0,
		anchorY: 0,
		selectedNodeId: null as string | null
	});


	// adding a state to track context menu
	const [edgeContextMenu, setEdgeContextMenu] = useState({
		isOpen: false,
		anchorX: 0,
		anchorY: 0,
		selectedEdgeId: null as string | null
	});


	const [showHelp] = useState(() => {
		// Get value from localStorage if it exists
		const savedVal = localStorage.getItem("showHelp");
		return savedVal || "true";
	})
	const [helpOpened, helpHandler] = useDisclosure((showHelp != "false"));

	const onInit = (instance: ReactFlowInstance) => {
		setReactFlowInstance(instance);
		// console.log(supabase)
	};


	// S: [OLD WORK] referenced in https://reactflow.dev/learn/customization/custom-edges
	const onConnect = useCallback(
		(params: Connection) => {
			// Ensure source and target are valid
			if (!params.source || !params.target) {
				console.error('Connection must have source and target');
				return;
			}

			const edge: CustomEdge = {
				id: uuidv4(),
				animated: true,
				type: 'custom-edge',
				source: params.source, // Guaranteed to be a string
				target: params.target, // Guaranteed to be a string
				sourceHandle: params.sourceHandle || null,
				targetHandle: params.targetHandle || null,
				data: { color: 'rgb(128, 128, 128)',
						thickness: 'default', // 'default' vs 'thick' 
						texture: 'solid' // 'solid' vs 'dashed' vs 'dotted'

				 }, // Add custom metadata
			};

			setEdges((eds) => addEdge(edge, eds) as CustomEdge[]);
		},
		[setEdges]
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
		console.log(`Signing up`);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error('Error signing up:', error.message);
			notifications.show({
				title: 'Error Signing Up',
				message: error.message,
				color: 'red',
			});
			return;
		}

		console.log('Sign up successful:', data);
		setSession(data.session);

		setSignUpOpened(false);
	};

	const handleSignIn = async (email: string, password: string) => {
		console.log(`Signing in`);

		const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (sessionError) {
			console.error('Error signing in:', sessionError);
			notifications.show({
				title: 'Error Signing In',
				message: sessionError.message,
				color: 'red',
			});
			return;
		}

		console.log('Sign in successful:', sessionData);

		setSession(sessionData.session);

		// try to get saved json from supabase
		const { data, error } = await supabase
			.from('user_data')
			.select()
			.eq('user_id', sessionData.session.user.id)
			.limit(1)
			.single()

		if (error) {
			console.log("failed to retrieve user's nodes", error);
			return;
		}

		console.log(data.user_data)
		const flow = data.user_data
		console.log(flow.nodes, flow.edges)
		setNodes(flow.nodes || []);
		setEdges(flow.edges || []);
		if (reactFlowInstance) {
			reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
		}


		setSignInOpened(false);
	};

	const handleOauthSignIn = async (provider: string) => {
		let gotrue_provider: Provider | null = null;
		switch (provider) {
			case "google":
				gotrue_provider = 'google';
				break;
			case "github":
				gotrue_provider = 'github';
				break;
			default:
				console.error("Invalid provider: ", provider)
		}
		if (gotrue_provider) {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: gotrue_provider
			})
			console.log(data, error)
			if (error) {
				notifications.show({
					title: 'Error Signing In',
					message: error.message,
					color: 'red',
				});
			}
		}
	}

	const handleLogOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error.message)
			notifications.show({
				title: 'Error Logging Out',
				message: error.message,
				color: 'red',
			});
		} else {
			setSession(null);
			const flowJson = localStorage.getItem(flowKey);
			if (flowJson != null) {
				console.log("user logged out, clearing canvas and replacing from local storage", flowJson);
				const flow = JSON.parse(flowJson);
				if (flow) {
					// const { x = 0, y = 0, zoom = 1 } = flow.viewport;
					console.log(flow.nodes, flow.edges)
					setNodes(flow.nodes || []);
					setEdges(flow.edges || []);
					if (reactFlowInstance) {
						reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
					}
					// setViewport({ x, y, zoom });
				}
			} else {
				console.log("user logged out, clearing canvas - localstorage empty", flowJson);
				setNodes([]);
				setEdges([]);
				if (reactFlowInstance) {
					reactFlowInstance?.setViewport(defaultViewport)
				}
			}
		}

	};



	const handlePasswordReset = () => {
	}

	const handleAuthModalSwitch = () => {
		if (signUpOpened) {
			setSignUpOpened(false)
			setSignInOpened(true)
		} else {
			setSignInOpened(false)
			setSignUpOpened(true)
		}
	}

	const handleSaveState = useCallback(async () => {
		if (!reactFlowInstance) {
			console.log("React flow instance null, nothing to save");
			return;
		}

		const flow = reactFlowInstance.toObject();

		if (!session) {
			console.log("User is not signed in, saving to local storage");
			localStorage.setItem(flowKey, JSON.stringify(flow));
			return;
		}

		const { data, error } = await supabase
			.from('user_data')
			.upsert({ user_id: session.user.id, user_data: flow })
			.select();

		if (data) {
			console.log("Successfully saved state", data);
		} else if (error) {
			console.log("Failed to save state", error);
			notifications.show({
				title: 'Error Saving Nodes',
				message: error.message,
				color: 'red',
			});
		}
	}, [reactFlowInstance, session]);

	const debouncedHandleSaveState = useMemo(
		() => debounce(handleSaveState, 500),
		[handleSaveState]
	);

	useEffect(() => {
		debouncedHandleSaveState();

		// Cleanup function to cancel debounce on unmount or when dependencies change
		return () => {
			debouncedHandleSaveState.cancel();
		};
	}, [nodes, edges, debouncedHandleSaveState]);



	const handleConfirm = () => {
		// make sure it won't show up in future
		localStorage.setItem('showHelp', "false")
	};


	const handleClose = () => {
		handleConfirm();
		helpHandler.close();
	};

	const onNodeContextMenu = (event: React.MouseEvent, node: any) => {
		event.preventDefault();

		//node positions by default use the react flow canvas coordiante system. convert it to screen space coordinates
		const nodePosInScreenSpace = reactFlowInstance?.flowToScreenPosition(node.position);

		//by default, the position of a node is its top left corner. to get the center of the node, we need to add half the width.
		//but the width of the node varies depending on the zoom level. to account for this, we need to multiply half the node width by the zoom level
		//get the zoom level of the canvas
		const zoomLevel = reactFlowInstance?.getZoom() ?? 1;

		setContextMenu({
			isOpen: true,
			anchorX: (nodePosInScreenSpace?.x ?? 0) + (node.measured.width / 2) * zoomLevel,
			anchorY: nodePosInScreenSpace?.y ?? 0,
			selectedNodeId: node.id
		});
	};

	// S: 
	const onEdgeContextMenu = (event: React.MouseEvent, edge: any) => {
		event.preventDefault();
		setEdgeContextMenu({
			isOpen: true,
			anchorX: event.clientX,
			anchorY: event.clientY,
			selectedEdgeId: edge.id,
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

	const onColorChange = () => {
		if (contextMenu.selectedNodeId) {
			const selectedNode = nodes.find(node => node.id === contextMenu.selectedNodeId);
			if (selectedNode) {
				setSelectedColor(selectedNode.data.backgroundColor as string);
				setColorModalOpened(true);
				setColorModalIsNode(true);
			}
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};


	const handleColorConfirm = (newColor: string) => {
		setEdges((prevEdges) =>
			prevEdges.map((edge) =>
				edge.id === selectedEdgeId
					? { ...edge, data: { ...edge.data, color: newColor } } // Update the color
					: edge
			)
		);
		setColorModalOpened(false); // Close the modal
	};

	//ALL FUNCTIONS FOR EDGE CUSTOMIZATION 
	const onColorChangeEdge = () => {
		if (edgeContextMenu.selectedEdgeId) {
			const selectedEdge = edges.find(edge => edge.id === edgeContextMenu.selectedEdgeId);
			if (selectedEdge) {
				setSelectedColor(selectedEdge.data.color); //  as string
				setColorModalOpened(true);
				setColorModalIsNode(false);
			}
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};


	const onDefaultThick = () => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							  ...edge, // Copy existing edge properties
							  data: {
								  ...edge.data, // Preserve other data properties
								  thickness: 'default', // Update thickness
							  },
						  }
						: edge // Keep other edges unchanged
				)
			);
		}
	
		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};

	const onThick = () => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							  ...edge, // Copy existing edge properties
							  data: {
								  ...edge.data, // Preserve other data properties
								  thickness: 'thick', // Update thickness
							  },
						  }
						: edge // Keep other edges unchanged
				)
			);
		}
	
		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};


	const onTextureSolid = () => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							  ...edge, // Copy existing edge properties
							  data: {
								  ...edge.data, // Preserve other data properties
								  texture: 'solid', // Update texture
							  },
						  }
						: edge // Keep other edges unchanged
				)
			);
		}
	
		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};

	const onTextureDashed = () => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							  ...edge, // Copy existing edge properties
							  data: {
								  ...edge.data, // Preserve other data properties
								  texture: 'dashed', // Update texture
							  },
						  }
						: edge // Keep other edges unchanged
				)
			);
		}
	
		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};

	const onTextureDotted = () => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							  ...edge, // Copy existing edge properties
							  data: {
								  ...edge.data, // Preserve other data properties
								  texture: 'dotted', // Update texture
							  },
						  }
						: edge // Keep other edges unchanged
				)
			);
		}
	
		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};


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

	const onDoubleClick = (event: React.MouseEvent) => {
		if (isMouseOverNode) return;

		//convert mouse coordinates to canvas coordinates
		const position = reactFlowInstance?.screenToFlowPosition({
			x: event.clientX - 30,
			y: event.clientY - 30,
		});

		const newNode = {
			id: uuidv4(),
			position: { x: position?.x ?? 0, y: position?.y ?? 0 },
			data: {
				label: "New Node",
				notes: "",
				backgroundColor: "#6c5ce7"
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

	const handleColorChange = (newColor: string, isNode: boolean) => {
		if (isNode) {
			setNodes(nodes.map(node => {
				if (node.id === contextMenu.selectedNodeId) {
					return {
						...node,
						data: { ...node.data, backgroundColor: newColor }
					};
				}
				return node;
			}));
		}
		else {
			setEdges(edges.map(edge => {
				if (edge.id === edgeContextMenu.selectedEdgeId) {
					return {
						...edge,
						data: { ...edge.data, color: newColor }
					};
				}
				return edge;
			}));
		}
	};




	if (loading) {
		return (
			<MantineProvider defaultColorScheme="dark">
				<Center style={{ width: '100vw', height: '100vh' }}>
					<Loader color="blue" size={'lg'} type="dots" />
				</Center>
			</MantineProvider>
		)
	}

	return (
		// why is mantine set to light mode by default?
		<MantineProvider defaultColorScheme="dark">
			<Notifications autoClose={5000} />
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
							onEdgeContextMenu={onEdgeContextMenu}

							onClick={onClick}
							onNodeClick={onNodeClick}

							//S: adding edge customization functionality
							// S: referenced https://reactflow.dev/learn/customization/custom-edges
							edgeTypes={edgeTypes}



							fitView
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
								saveCanvas={() => { handleSaveState() }}
							/>
							<Background variant={BackgroundVariant.Dots} gap={24} size={2} />
						</ReactFlow>
						<ContextMenu
							isOpen={contextMenu.isOpen}
							setOpen={(open) => setContextMenu(prev => ({ ...prev, isOpen: open }))}
							anchorX={contextMenu.anchorX}
							anchorY={contextMenu.anchorY}
							onShapeChange={onShapeChange}
							onEdit={onEdit}
							onDelete={onDelete}
							onColorChange={onColorChange}
						/>
						<EdgeContextMenu
							isOpen={edgeContextMenu.isOpen}
							setOpen={(open) => setEdgeContextMenu(prev => ({ ...prev, isOpen: open }))}
							anchorX={edgeContextMenu.anchorX}
							anchorY={edgeContextMenu.anchorY}
							onThick={onThick}
							onDefaultThick={onDefaultThick}
							//onEditLabel={onEditLabel}
							onTextureSolid={onTextureSolid}
							onTextureDashed={onTextureDashed}
							onTextureDotted={onTextureDotted}
							onColorChangeEdge={onColorChangeEdge}
						// onDirectionRight={onDirectionRight}
						// onDirectionLeft={onDirectionLeft}
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
						<ColorPickerModal
							opened={colorModalOpened}
							onClose={() => setColorModalOpened(false)}
							onConfirm={handleColorChange}
							initialColor={selectedColor}
							isForNode={colorModalIsNode}
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
							onOauthConfirm={handleOauthSignIn}
							onSignIn={handleAuthModalSwitch}
						/>

						<SignInModal
							opened={signInOpened}
							onClose={() => setSignInOpened(false)}
							onConfirm={handleSignIn}
							onOauthConfirm={handleOauthSignIn}
							onSignUp={handleAuthModalSwitch}
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

					<NodeList nodeList={nodes} />
				</ReactFlowProvider>
			</ModalsProvider>
		</MantineProvider>
	);
}

/** 
* used in NodeList, RectNode, and CircleNode to adapt text color depending on background color.
* Calculates luminance of background color and returns 'white' or 'black'
*/
export function adaptTextColor(hex: string) {
	//remove # from hex string
	hex = hex.replace(/^#/, '');

	//convert to normal base 10 integer
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	//from https://en.wikipedia.org/w/index.php?title=Relative_luminance#Relative_luminance_and_%22gamma_encoded%22_colorspaces
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

	return luminance < 128 ? 'white' : 'black';
}