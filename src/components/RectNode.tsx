import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'

// Custom node component to render as a rectangle
const RectNode = ({ data }: any) => {
	console.log('Current color:', data.backgroundColor);
	return (
        <div className="rect" style={{background: data.backgroundColor}}>
			{data.label}
            <Handle type="source" position={Position.Top} id="top" />
            <Handle type="source" position={Position.Left} id="left" />
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
	);
};
export default RectNode;