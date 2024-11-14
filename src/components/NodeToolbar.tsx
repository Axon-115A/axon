import { NodeToolbar, Position } from '@xyflow/react';
import { FC } from 'react';

interface NodeToolbarProps {
    //label: string;
    onShapeChange: () => void;
    onEdit: () => void;
    onDelete: () => void;
    isOpen: boolean;
}

const NodeBar: FC<NodeToolbarProps> = ({ onEdit, onDelete, onShapeChange, isOpen }) => {
    console.log("toolbar open?:" + isOpen);
    return (
        <NodeToolbar
        isVisible={isOpen}
        position={Position.Top}
        >
            <div>
                <button onClick={onShapeChange}>Change Shape</button>
                <button onClick={onEdit}>Edit Label</button>
                <button onClick={() => onDelete()}>Delete Node</button>
            </div>
        </NodeToolbar>
    );
};

export default NodeBar;
