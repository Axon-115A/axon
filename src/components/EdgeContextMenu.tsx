import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { FC } from 'react';
import './styles/EdgeContextMenu.css'
import EditLabel from './../assets/edge_icons/edit label.svg';
import Thin from './../assets/edge_icons/thin line.svg'
import Thick from './../assets/edge_icons/thick line.svg'
import Solid from './../assets/edge_icons/solid.svg'
import Dashed from './../assets/edge_icons/dashed.svg'
import Dotted from './../assets/edge_icons/dotted1.svg'
import Right from './../assets/edge_icons/right.svg'
import Left from './../assets/edge_icons/left.svg'
import ColorWheel from './../assets/colorWheel.svg';
interface EdgeContextMenuProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    anchorX: number;
    anchorY: number;
    onEditEdgeLabel: () => void;
    onThicknessChange: (thickness: string) => void;
    onTextureChange: (texture: string) => void;
    onColorChangeEdge: () => void;
    onAddArrow: (source: boolean) => void;
}



const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ isOpen, setOpen, anchorX, anchorY, onColorChangeEdge, onThicknessChange, onTextureChange, onEditEdgeLabel, onAddArrow }) => {
    return (
        <ControlledMenu
            anchorPoint={{ x: anchorX, y: anchorY }}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}
            theming='dark'
            className="custom-menu"
        >
            <div className='hex-menu'>
                <div className="hex-row">
                    <MenuItem value="Change to Solid" onClick={() => { onTextureChange('default') }}>
                        <div className='menu-item solid'>
                            <img src={Solid} />
                        </div>
                    </MenuItem>
                </div>


                <div className="hex-row">
                    <MenuItem value="Change to Thick" onClick={() => { onThicknessChange('thick') }}>
                        <div className="menu-item thick">
                            <img src={Thick} />
                        </div>
                    </MenuItem>
                    <MenuItem value="Toggle source arrow" onClick={() => { onAddArrow(true) }}>
                        <div className="menu-item rightArrow">
                            <img src={Right} />
                        </div>
                    </MenuItem>
                </div>


                <div className="hex-row">
                    <MenuItem value="EditEdgeLabel" onClick={onEditEdgeLabel}>
                        <div className="menu-item editLabel">
                            <img src={EditLabel} />
                        </div>
                    </MenuItem>
                    <MenuItem value="Change to Dashed" onClick={() => { onTextureChange('dashed') }}>
                        <div className="menu-item dashed">
                            <img src={Dashed} />
                        </div>
                    </MenuItem>
                    <MenuItem value="Change Color" onClick={onColorChangeEdge}>
                        <div className="menu-item colorPicker" >
                            <img src={ColorWheel} />
                        </div>
                    </MenuItem>
                </div>


                <div className="hex-row">
                    <MenuItem value="Change to Thin" onClick={() => { onThicknessChange('default') }}>
                        <div className="menu-item thin">
                            <img src={Thin} />
                        </div>
                    </MenuItem>
                    <MenuItem value="Toggle destination arrow" onClick={() => { onAddArrow(false) }}>
                        <div className="menu-item leftArrow"  >
                            <img src={Left} />
                        </div>
                    </MenuItem>
                </div>


                <div className="hex-row">

                    <MenuItem value="Change Dotted" onClick={() => { onTextureChange('dotted') }}>
                        <div className="menu-item dotted">
                            <img src={Dotted} />
                        </div>
                    </MenuItem>

                </div>
            </div>


        </ControlledMenu >
    );
};

export default EdgeContextMenu;