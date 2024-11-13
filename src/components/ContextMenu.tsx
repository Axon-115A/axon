import { NodeToolbar, Position } from '@xyflow/react';
import { FC } from 'react';

interface NodeToolbarProps {
    //label: string;
    onShapeChange: () => void;
    setOpen: (open: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
    isOpen: boolean;
}

const Toolbar: FC<NodeToolbarProps> = ({ onEdit, onDelete, onShapeChange, isOpen, setOpen }) => {
    console.log("toolbar open?:" + isOpen);
    return (
        <NodeToolbar
        isVisible={isOpen}
        position={Position.Top}
        >
            <div style={{ position: 'absolute', top: 100, left: 100 }}>
                <p>AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</p>
                <button onClick={onShapeChange}>Change Shape</button>
                <button onClick={onEdit}>Edit Label</button>
                <button onClick={() => onDelete()}>Delete Node</button>
            </div>
        </NodeToolbar>
    );
};

export default Toolbar;
