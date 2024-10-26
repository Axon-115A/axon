import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'

// Custom node component to render as a rectangle
const RectNode = ({ data }: any) => {
	return (
		<div className="rect">
			{data.label}
			{/* superimposing a big transparent handle on top of the existing one to create our desired effect */}
			<Handle type="source" position={Position.Top} className="invisibleHandle" id="topFake" />   
			<Handle type="source" position={Position.Top} className="handle" id="top" /> 
			
			<Handle type="source" position={Position.Left} className="invisibleHandle" id="leftFake" />
			<Handle type="source" position={Position.Left} className="handle" id="left" /> 


			<Handle type="source" position={Position.Right} className="invisibleHandle" id="rightFake" />
			<Handle type="source" position={Position.Right} className="handle" id="right" /> 

			<Handle type="source" position={Position.Bottom} className="invisibleHandle" id="bottomFake" />
			<Handle type="source" position={Position.Bottom} className="handle" id="bottom" /> 
		</div>
	);
};

export default RectNode;