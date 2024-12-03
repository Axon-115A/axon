import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';
import ColorWheel from './../assets/colorWheel.svg';
import Shapes from './../assets/node_icons/shapes.svg';
import Rename from './../assets/node_icons/pencil-square.svg';
import TrashIcon from './../assets/node_icons/trash3.svg';
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

// Nikolas worked on adding buttons to the controlled menu, such as color, shape, rename, and trash.

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
                <MenuItem value="Change Color" onClick={onColorChange} title='Color Picker'>
                    <div>
                        <img src={ColorWheel} />
                    </div>
                </MenuItem>
                <MenuItem value="Change Shape" onClick={onShapeChange} title='Change Shape'>
                    <div>
                        <img src={Shapes} />
                    </div>
                </MenuItem>
                <MenuItem value="Rename" onClick={onEdit} title='Edit label'>
                    <div>
                        <img src={Rename} />
                    </div>
                </MenuItem>
                <MenuItem value="Delete" onClick={onDelete} title='Delete'>
                    <div>
                        <img src={TrashIcon} />
                    </div>
                </MenuItem>
            </div>
        </ControlledMenu>
    );
};

export default ContextMenu;