import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';

interface EdgeContextMenuProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    anchorX: number;
    anchorY: number;
    onEditLabel: () => void;
    onThickness: () => void;
    onTexture: () =>void;
    onColorChangeEdge: () => void;
    onDirectionLeft: () => void;
    onDirectionRight: () => void;
}

// context menu {{}} onEdit, onColorChange
const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ isOpen, setOpen, anchorX, anchorY, onEditLabel, onThickness, onTexture, onColorChangeEdge, onDirectionLeft, onDirectionRight }) => {
	return (
        <ControlledMenu
            anchorPoint={{x: anchorX, y: anchorY}}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}
            theming='dark'
        >
            <MenuItem value="Rename" onClick={onEditLabel}>
                Set Label
            </MenuItem>
            <MenuItem value="Change Color" onClick={onThickness}>
                Change Color
            </MenuItem>
            <MenuItem value="Change Color" onClick={onTexture}>
                Change Color
            </MenuItem>
            <MenuItem value="Change Color" onClick={onColorChangeEdge}>
                Change Color
            </MenuItem>
            <MenuItem value="Change Color" onClick={onDirectionLeft}>
                Change Color
            </MenuItem>
            <MenuItem value="Change Color" onClick={onDirectionRight}>
                Change Color
            </MenuItem>
        </ControlledMenu>
      );
};

export default EdgeContextMenu;