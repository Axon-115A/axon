import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'
import { adaptTextColor } from '../App';

const CircleNode = ({ data }: any) => {
	return (
		<div className="circle" style={{background: data.backgroundColor}}>
			<div style={{
				textAlign: 'center',
				width: '100%',
				color: adaptTextColor(data.backgroundColor ?? "#6c5ce7")
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
