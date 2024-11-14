import { Handle, Position } from '@xyflow/react'; 
import './styles/Handles.css';
import './styles/NodeShapes.css';
import NodeBar from "./NodeToolbar.tsx";

// Custom node component to render as a rectangle
const RectNode = ({ data }: any) => {

  return (
    <div className="rect">
      {data.label}

      {/* Pass the functions and state to the NodeBar */}
      <NodeBar
      />

      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
};

export default RectNode;
