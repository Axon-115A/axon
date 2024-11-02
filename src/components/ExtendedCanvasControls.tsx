import { Controls, ControlButton } from '@xyflow/react';
import TrashIcon from './../assets/trash.svg';

interface ExtendedCanvasControlsProps {
    clearCanvas: () => void;
    position: any;
}

const ExtendedCanvasControls: React.FC<ExtendedCanvasControlsProps> = ({ clearCanvas, position }) => {
    return (
        <Controls position={position}>
            <ControlButton onClick={clearCanvas} title='Clear graph'>
                <div>
                    <img src={TrashIcon} />
                </div>
            </ControlButton>
        </Controls>
    )
}

export default ExtendedCanvasControls;