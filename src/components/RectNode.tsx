import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'
import { adaptTextColor } from '../Utilities';

const RectNode = ({ data }: any) => {

    return (
        <div className="rect" style={{ background: data.backgroundColor }}>
            <div style={{ color: adaptTextColor(data.backgroundColor ?? "#6c5ce7")}}>
                {data.label}
            </div>
            <Handle type="source" position={Position.Top} id="top" />
            <Handle type="source" position={Position.Left} id="left" />
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
    );
};
export default RectNode;