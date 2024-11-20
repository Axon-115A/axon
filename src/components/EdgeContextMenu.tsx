import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';

interface EdgeContextMenuProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    anchorX: number;
    anchorY: number;
    onEditEdgeLabel: () => void;
    
    onThick: () => void;
    onDefaultThick: () => void;
    
    onTextureSolid: () =>void;
    onTextureDashed: () =>void;
    onTextureDotted: () =>void;


    onColorChangeEdge: () => void;
    
    onDirectionLeft: () => void;
    onDirectionRight: () => void;
}

// context menu {{}} onEdit, onColorChange, 
// onEditLabel, onThickness, onTexture,  onDirectionLeft, onDirectionRight 
const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ isOpen, setOpen, anchorX, anchorY, onColorChangeEdge, onThick, onDefaultThick, onTextureSolid, onTextureDashed, onEditEdgeLabel, onTextureDotted, onDirectionLeft, onDirectionRight}) => {
	return (
        <ControlledMenu
            anchorPoint={{x: anchorX, y: anchorY}}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}
            theming='dark'
        >
            <MenuItem value="Rename" onClick={onEditEdgeLabel}>
                Set Label
            </MenuItem>
            <MenuItem value="Change to Thick" onClick={onThick}>
                Thick
            </MenuItem>
            <MenuItem value="Change to Thin" onClick={onDefaultThick}>
                Thin
            </MenuItem>
            <MenuItem value="Change Color" onClick={onColorChangeEdge}>
                Change Color
            </MenuItem>
            <MenuItem value="Change to Solid" onClick={onTextureSolid}>
                Solid
            </MenuItem>
            <MenuItem value="Change to Dashed" onClick={onTextureDashed}>
                Dashed
            </MenuItem>
            <MenuItem value="Change Dotted" onClick={onTextureDotted}>
                Dotted
            </MenuItem>
            <MenuItem value="Change Left Direction" onClick={onDirectionLeft}>
                left
            </MenuItem>
            <MenuItem value="Change Right Direction" onClick={onDirectionRight}>
                right
            </MenuItem>
        </ControlledMenu>
      );
};

export default EdgeContextMenu;