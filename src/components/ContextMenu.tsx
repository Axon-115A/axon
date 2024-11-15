import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';

interface ContextMenuProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    anchorX: number;
    anchorY: number;
    onShapeChange: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onColorChange: () => void;
}

// context menu
const ContextMenu: FC<ContextMenuProps> = ({ isOpen, setOpen, anchorX, anchorY, onShapeChange, onEdit, onDelete, onColorChange }) => {
	return (
        <ControlledMenu
            anchorPoint={{x: anchorX, y: anchorY}}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}
            theming='dark'
        >
            <MenuItem value="Change Color" onClick={onColorChange}>
                Change Color
            </MenuItem>
            <MenuItem value="Change Shape" onClick={onShapeChange}>
                Change Shape
            </MenuItem>
            <MenuItem value="Edit" onClick={onEdit}>
                Edit
            </MenuItem>
            <MenuItem value="Delete" onClick={onDelete}>
                Delete
            </MenuItem>
        </ControlledMenu>
      );
};

export default ContextMenu;