import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Custom node component to render as a circle

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
			<Handle type="source" position={Position.Top} style={{ borderRadius: '50%' }} id="top" />
			<Handle type="source" position={Position.Left} style={{ borderRadius: '50%' }} id="left" />
			<Handle type="source" position={Position.Right} style={{ borderRadius: '50%' }} id="right" />
			<Handle type="source" position={Position.Bottom} style={{ borderRadius: '50%' }} id="bottom" />
		</div>
	);
};

export default RectNode;