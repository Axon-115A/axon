import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Custom node component to render as a circle
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
			border: '2px solid #81ecec',
		}}>
			{data.label}
			<Handle type="target" position={Position.Top} style={{ borderRadius: '50%' }} />
			<Handle type="source" position={Position.Bottom} style={{ borderRadius: '50%' }} />
		</div>
	);
};

export default RectNode;