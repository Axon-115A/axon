import { Controls, ControlButton } from '@xyflow/react';
import TrashIcon from './../assets/trash.svg';
import SaveIcon from './../assets/floppy.svg';

interface ExtendedCanvasControlsProps {
    clearCanvas: () => void;
    position: any;
    saveCanvas: () => void;
}

const ExtendedCanvasControls: React.FC<ExtendedCanvasControlsProps> = ({ clearCanvas, position, saveCanvas }) => {
    return (
        <Controls position={position}>
            <ControlButton onClick={clearCanvas} title='Clear graph'>
                <div>
                    <img src={TrashIcon} />
                </div>
            </ControlButton>
            <ControlButton onClick={saveCanvas} title='Save graph'>
                <div>
                    <img src={SaveIcon} />
                </div>
            </ControlButton>
        </Controls>
    )
}

export default ExtendedCanvasControls;