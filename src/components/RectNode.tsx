import { Handle, Position, NodeToolbar } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'

// Custom node component to render as a rectangle
const RectNode = ({ data }: any) => {

	return (
		<div className="rect">
			{data.label}

			{/* node toolbar needs to be defined here for it to appear over a node */}
			<NodeToolbar position={data.toolbarPosition}>
				<button>delete</button>
				<button>copy</button>
				<button>expand</button>
			</NodeToolbar>

			<Handle type="source" position={Position.Top} id="top" />
			<Handle type="source" position={Position.Left} id="left" />
			<Handle type="source" position={Position.Right} id="right" />
			<Handle type="source" position={Position.Bottom} id="bottom" />
		</div>
	);
};

export default RectNode;