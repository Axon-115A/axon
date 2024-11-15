import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'

// Custom node component to render as a circle
const CircleNode = ({ data }: any) => {
	return (
		<div className="circle">
			<div style={{
				textAlign: 'center',
				width: '100%',
				background: data.backgroundColor
			}}>
				{data.label}
			</div>
			
			<Handle type="source" position={Position.Top} id="top" /> 
			<Handle type="source" position={Position.Left}  id="left" /> 
			<Handle type="source" position={Position.Right} id="right" /> 
			<Handle type="source" position={Position.Bottom}  id="bottom" /> 
		</div>
	);
};

export default CircleNode;
