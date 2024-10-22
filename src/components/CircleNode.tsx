import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Custom node component to render as a circle
const CircleNode = ({ data }: any) => {
	return (
		<div style={{
			width: '75px',
			height: '75px',
			borderRadius: '50%',
			backgroundColor: '#6c5ce7',
			color: 'white',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			// border: '2px solid #81ecec',
		}}>
			<div style={{
				textAlign: 'center',
				width: '100%'
			}}>
				{data.label}
			</div>
			<Handle type="source" position={Position.Top} style={{ borderRadius: '50%' }} id="top" />
			<Handle type="source" position={Position.Left} style={{ borderRadius: '50%' }} id="left" />
			<Handle type="source" position={Position.Right} style={{ borderRadius: '50%' }} id="right" />
			<Handle type="source" position={Position.Bottom} style={{ borderRadius: '50%' }} id="bottom" />
		</div>
	);
};

export default CircleNode;
