import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';

interface EdgeContextMenuProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    anchorX: number;
    anchorY: number;
    // onEditLabel: () => void;
    
    onThick: () => void;
    onDefaultThick: () => void;
    
    // onTexture: () =>void;
    onColorChangeEdge: () => void;
    // onDirectionLeft: () => void;
    // onDirectionRight: () => void;
}

// context menu {{}} onEdit, onColorChange, 
// onEditLabel, onThickness, onTexture,  onDirectionLeft, onDirectionRight 
const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ isOpen, setOpen, anchorX, anchorY, onColorChangeEdge, onThick, onDefaultThick}) => {
	return (
        <ControlledMenu
            anchorPoint={{x: anchorX, y: anchorY}}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}
            theming='dark'
        >
            {/* <MenuItem value="Rename" onClick={onEditLabel}>
                Set Label
            </MenuItem> */}
            <MenuItem value="Change Color" onClick={onThick}>
                Thick
            </MenuItem>
            <MenuItem value="Change Color" onClick={onDefaultThick}>
                Thin
            </MenuItem>
            <MenuItem value="Change Color" onClick={onColorChangeEdge}>
                Change Color
            </MenuItem>
            {/* <MenuItem value="Change Color" onClick={onDirectionLeft}>
                Change Color
            </MenuItem>
            <MenuItem value="Change Color" onClick={onDirectionRight}>
                Change Color
            </MenuItem> */}
        </ControlledMenu>
      );
};

export default EdgeContextMenu;