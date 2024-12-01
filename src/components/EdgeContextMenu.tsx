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
    
    onThicknessChange: (thickness: string) => void;
    
    onTextureChange: (texture: string) =>void;


    onColorChangeEdge: () => void;
    
    onAddArrow: (source: boolean) => void;
}

// context menu {{}} onEdit, onColorChange, 
// onEditLabel, onThickness, onTexture,  onDirectionLeft, onDirectionRight 
const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ isOpen, setOpen, anchorX, anchorY, onColorChangeEdge, onThicknessChange, onTextureChange, onEditEdgeLabel, onAddArrow}) => {
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
            <MenuItem value="Change to Thick" onClick={() => {onThicknessChange('thick')}}>
                Thick
            </MenuItem>
            <MenuItem value="Change to Thin" onClick={() => {onThicknessChange('default')}}>
                Thin
            </MenuItem>
            <MenuItem value="Change Color" onClick={onColorChangeEdge}>
                Change Color
            </MenuItem>
            <MenuItem value="Change to Solid" onClick={() => {onTextureChange('default')}}>
                Solid
            </MenuItem>
            <MenuItem value="Change to Dashed" onClick={() => {onTextureChange('dashed')}}>
                Dashed
            </MenuItem>
            <MenuItem value="Change Dotted" onClick={() => {onTextureChange('dotted')}}>
                Dotted
            </MenuItem>
            <MenuItem value="Toggle source arrow" onClick={() => {onAddArrow(true)}}>
                Toggle source arrow
            </MenuItem>
            <MenuItem value="Toggle destination arrow" onClick={() => {onAddArrow(false)}}>
                Toggle destination arrow
            </MenuItem>
        </ControlledMenu>
      );
};

export default EdgeContextMenu;