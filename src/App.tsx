import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ReactFlow,
	useNodesState,
	addEdge,
	MiniMap,
	Background,
	MarkerType,
	ReactFlowProvider,
	ReactFlowInstance,
	BackgroundVariant,
	getIncomers,
	getOutgoers,
	getConnectedEdges,
	ConnectionMode,
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

import { Session } from '@supabase/supabase-js'
import debounce from 'lodash.debounce';

// custom components
import { Connection, Edge } from 'reactflow';
import { useEdgesState } from '@xyflow/react';
import CustomEdge from './components/CustomEdge';
import EdgeContextMenu from './components/EdgeContextMenu';
import CircleNode from './components/CircleNode';
import RectNode from './components/RectNode';
import CustomNode from './components/CustomNode';

import ContextMenu from './components/ContextMenu';
import NotesWindow from './components/NotesWindow';
import NotesWindowMantine from './components/NotesWindowMantine';
import NotesWindowBlocknote from './components/NotesWindowBlocknote';
import HelpModal from './components/modals/HelpModal';
import ClearModal from './components/modals/ClearModal';
import EditLabelModal from './components/modals/EditLabelModal';
import ExtendedCanvasControls from './components/ExtendedCanvasControls';
import SignInModal from "./components/auth/SignIn"
import SignUpModal from './components/auth/SignUp';
import LogOutModal from './components/auth/LogOut';
import NodeList from './components/NodeList';
import ColorPickerModal from './components/modals/ColorPickerModal';

import * as Login from './Login';
import ChosenColorScheme from './AxonRollYourOwnColorSchemeConstructionSet';

const initialNodes: any = [];
// const initialEdges: any = [];


const nodeTypes = { 'circle': CircleNode, 'rect': RectNode, 'custom': CustomNode };
const proOptions = { hideAttribution: true };


// S: imports needed for edge customizations
const edgeTypes = {
	'custom-edge': CustomEdge,
};
export type CustomEdge = Edge & {
	data: {
		color: string;
		thickness?: 'default' | 'thic';
		texture?: 'solid' | 'dashed' | 'dotted';
		label?: string;
		startArrowVisible?: boolean;
		endArrowVisible?: boolean;
	};
}

const initialEdges = [] as CustomEdge[];


export default function App() {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


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
	const [editModalIsNode, setEditModalIsNode] = useState(true)

	useEffect(() => {
		Login.fetchSession(setSession, setNodes, setEdges, reactFlowInstance, setLoading);
	}, []);

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

	const onConnect = useCallback(
		(params: Connection) => {
			// Ensure source and target are valid
			if (!params.source || !params.target) {
				console.error('Connection must have source and target');
				return;
			}

			const edge = {
				...params,
				id: uuidv4(),
				animated: true,
				selected: false,
				type: 'custom-edge',
				data: {
					color: ChosenColorScheme.defaultEdgeColor, //'#808080',
					thickness: 'default',
					texture: 'solid',
					label: '',
					startArrowVisible: false,
					endArrowVisible: false
				},
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: ChosenColorScheme.defaultEdgeColor
				},
				markerStart: {
					type: MarkerType.ArrowClosed,
					color: ChosenColorScheme.defaultEdgeColor
				},

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
			localStorage.setItem(Login.flowKey, JSON.stringify(flow));
			return;
		}

		const { data, error } = await Login.supabase
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
						data: {
							...node.data,
							shape: (node.data.shape == 'rect') ? 'circle' : 'rect' 
						}
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

	const handleLabelChange = (newLabel: string, isForNode: boolean) => {
		if (isForNode) {
			setNodes(nodes.map(node => {
				if (node.id === contextMenu.selectedNodeId) {
					return {
						...node,
						data: { ...node.data, label: newLabel },
					};
				}
				return node;
			}));
		} else {
			setEdges(edges.map(edge => {
				if (edge.id === edgeContextMenu.selectedEdgeId) {
					return {
						...edge,
						data: { ...edge.data, label: newLabel },
					};
				}
				return edge;
			}));
		}
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


	const onEdgeThicknessChange = (newThickness: string) => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							...edge,
							data: {
								...edge.data,
								thickness: newThickness,
							},
						}
						: edge
				)
			);
		}

		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};

	const onEdgeTextureChange = (textureType: string) => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) =>
					edge.id === edgeContextMenu.selectedEdgeId
						? {
							...edge,
							data: {
								...edge.data,
								texture: textureType,
							},
						}
						: edge
				)
			);
		}

		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};

	const onAddArrow = (source: boolean) => {
		if (edgeContextMenu.selectedEdgeId) {
			setEdges(edges.map((edge) => {
				if (edge.id === edgeContextMenu.selectedEdgeId) {
					return {
						...edge,
						data: {
							...edge.data,
							startArrowVisible: (source) ? !edge.data.startArrowVisible : edge.data.startArrowVisible,
							endArrowVisible: (!source) ? !edge.data.endArrowVisible : edge.data.endArrowVisible,
						}
					}
				}

				return edge;
			}))
		}
		setEdges((prevEdges) => [...prevEdges]);
		setContextMenu((prev) => ({ ...prev, isOpen: false }));
	};

	const onEditEdgeLabel = () => {
		if (edgeContextMenu.selectedEdgeId) {
			const selectedEdge = edges.find(edges => edges.id === edgeContextMenu.selectedEdgeId);
			if (selectedEdge) {
				setCurrentLabel(selectedEdge.data.label as string);
				setEditModalOpened(true);
				setEditModalIsNode(false);
			}
		}
		setContextMenu(prev => ({ ...prev, isOpen: false }));
	};

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
				backgroundColor: ChosenColorScheme.defaultNodeColor, //"#6c5ce7"
				shape: "rect"
			},
			type: 'custom',
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
						data: {
							...edge.data,
							color: newColor
						},
						markerEnd: {
							...edge.markerEnd,
							color: newColor
						},
						markerStart: {
							...edge.markerStart,
							color: newColor
						},
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
							
							fitView
							onInit={onInit}
							colorMode='dark'
							deleteKeyCode='Delete'
							proOptions={proOptions}
							nodeTypes={nodeTypes}
							edgeTypes={edgeTypes}

							connectionMode={ConnectionMode.Loose}
							onNodeMouseEnter={() => { setMouseOverNode(true) }}   //this way, if the mouse is over a node, isMouseOverNode = true
							onNodeMouseLeave={() => { setMouseOverNode(false) }}  //this can be checked in onDoubleClick to prevent placing a new node when double clicking on an existing node
							onNodesDelete={onNodeDelete}
							connectionRadius={35} //the min distance an edge has to be dragged close to a handle before it snaps to it. default is 20
						>
						<div>
							{/* <MiniMap 
								position="bottom-left" 
								style={{ position: 'absolute', bottom: '0px', left: '30px' }} 
								nodeColor={(node: any) => {return node.data.backgroundColor}} 
								maskColor={ChosenColorScheme.minimap} 
								pannable
								zoomable
								zoomStep={1}
							/> */}
							<ExtendedCanvasControls
								clearCanvas={() => setClearModalOpened(true)}
								position="bottom-left"
								saveCanvas={() => { handleSaveState() }}
								helpHandler={helpHandler}
							/>
						</div>
							
						<Background style={{ backgroundColor: ChosenColorScheme.background }} variant={BackgroundVariant.Dots} gap={24} size={2} />
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

							onThicknessChange={onEdgeThicknessChange}
							onEditEdgeLabel={onEditEdgeLabel}
							onTextureChange={onEdgeTextureChange}
							onColorChangeEdge={onColorChangeEdge}

							onAddArrow={onAddArrow}

							// onDirectionRight={onDirectionRight}
							// onDirectionLeft={onDirectionLeft}

						/>

						<EditLabelModal
							opened={editModalOpened}
							label={currentLabel}
							onClose={() => setEditModalOpened(false)}
							onConfirm={handleLabelChange}
							isForNode={editModalIsNode}

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
								<Button onClick={() => setLogOutOpened(true)} style={{ backgroundColor: ChosenColorScheme.signUpInButtons }}>
									Log Out
								</Button>
							) : (
								<>
									<Button onClick={() => setSignUpOpened(true)} style={{ backgroundColor: ChosenColorScheme.signUpInButtons }}>
										Sign Up
									</Button>

									<Button onClick={() => setSignInOpened(true)} style={{ backgroundColor: ChosenColorScheme.signUpInButtons }}>
										Sign In
									</Button>
								</>
							)}


						</div>

						<SignUpModal
							isOpen={signUpOpened}
							onClose={() => setSignUpOpened(false)}
							switchAuthModals={handleAuthModalSwitch}

							setSession={setSession}
							setSignUpOpened={setSignUpOpened}
						/>

						<SignInModal
							isOpen={signInOpened}
							onClose={() => setSignInOpened(false)}
							switchAuthModals={handleAuthModalSwitch}

							setSession={setSession}
							setNodes={setNodes}
							setEdges={setEdges}
							reactFlowInstance={reactFlowInstance}
							setSignInOpened={setSignInOpened}
						/>

						<LogOutModal
							isOpen={logOutOpened}
							onClose={() => setLogOutOpened(false)}

							setSession={setSession}
							setNodes={setNodes}
							setEdges={setEdges}
							reactFlowInstance={reactFlowInstance}
						/>

					</div>
					{showNotesWindow &&
						<NotesWindowBlocknote
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