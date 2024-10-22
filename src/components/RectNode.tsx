import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Custom node component to render as a rectangle

const initialEdges = [
	{ id: 'edge-1', source: 'node-1', sourceHandle: 'a', target: 'node-2' },
	{ id: 'edge-2', source: 'node-1', sourceHandle: 'b', target: 'node-3' },
  ];

const RectNode = ({ data }: any) => {
	return (
		<div style={{
			width: '180px',
			height: '60px',
			// borderRadius: '50%',
			color: 'white',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#6c5ce7',
			borderRadius: '2px'
			// border: '2px solid #81ecec',
		}}>
			{data.label}
			{/* superimposing a big transparent handle on top of the existing one to create our desired effect */}
			<Handle type="source" position={Position.Top} style={{borderRadius: '50%' , pointerEvents: 'none' }} id="topFake" />   
			<Handle type="source" position={Position.Top} style={{borderRadius: '50%', border: '10px solid transparent', background: 'transparent', pointerEvents: 'auto' }} id="top" /> 
			
			<Handle type="source" position={Position.Left} style={{borderRadius: '50%', pointerEvents: 'none' }} id="leftFake" />
			<Handle type="source" position={Position.Left} style={{borderRadius: '50%', border: '10px solid transparent', background: 'transparent', pointerEvents: 'auto' }} id="left" /> 


			<Handle type="source" position={Position.Right} style={{borderRadius: '50%', pointerEvents: 'none' }} id="rightFake" />
			<Handle type="source" position={Position.Right} style={{borderRadius: '50%', border: '10px solid transparent', background: 'transparent', pointerEvents: 'auto' }} id="right" /> 

			<Handle type="source" position={Position.Bottom} style={{borderRadius: '50%', pointerEvents: 'none' }} id="bottomFake" />
			<Handle type="source" position={Position.Bottom} style={{borderRadius: '50%', border: '10px solid transparent', background: 'transparent', pointerEvents: 'auto' }} id="bottom" /> 
		</div>
	);
};

export default RectNode;