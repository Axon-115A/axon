import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';
import Palette from './../assets/palette.svg';
import ColorWheel from './../assets/colorWheel.svg';
import Shapes from './../assets/shapes.svg';
import Rename from './../assets/pencil-square.svg';
import TrashIcon from './../assets/trash3.svg';
import './styles/ContextMenu.css'

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
            anchorPoint={{ x: anchorX, y: anchorY }}
            state={isOpen ? 'open' : 'closed'}
            direction="top"
            onClose={() => setOpen(false)}
            theming='dark'
            className="custom-menu"
            align='center'
        >
            <div className="menu-row">
                <MenuItem value="Change Color" onClick={onColorChange}>
                    <div>
                        <img src={ColorWheel} />
                    </div>
                </MenuItem>
                <MenuItem value="Change Shape" onClick={onShapeChange}>
                    <div>
                        <img src={Shapes} />
                    </div>
                </MenuItem>
                <MenuItem value="Rename" onClick={onEdit}>
                    <div>
                        <img src={Rename} />
                    </div>
                </MenuItem>
                <MenuItem value="Delete" onClick={onDelete}>
                    <div>
                        <img src={TrashIcon} />
                    </div>
                </MenuItem>
            </div>
        </ControlledMenu>
    );
};

export default ContextMenu;