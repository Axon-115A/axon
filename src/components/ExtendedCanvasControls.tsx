import { Controls, ControlButton } from '@xyflow/react';
import TrashIcon from './../assets/trash.svg';
import SaveIcon from './../assets/floppy.svg';
import QuestionIcon from './../assets/question-circle.svg';

import ChosenColorScheme from '../AxonRollYourOwnColorSchemeConstructionSet';

interface ExtendedCanvasControlsProps {
    clearCanvas: () => void;
    position: any;
    saveCanvas: () => void;
    helpHandler: { open: () => void };
}

const ExtendedCanvasControls: React.FC<ExtendedCanvasControlsProps> = ({ clearCanvas, position, saveCanvas, helpHandler }) => {
    //todo: find a better way to force color scheme
    document.documentElement.style.setProperty('--xy-controls-button-background-color', 'var(--canvas-controls)');
    const a = getComputedStyle(document.documentElement).getPropertyValue('--canvas-controls').trim();

    //console.log(a);
    return (
        <Controls position={position} showInteractive={ false } style={{ display: 'flex', gap: '2px' }}>
            <ControlButton onClick={helpHandler.open} title='Help'>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={QuestionIcon} alt="Help" />
                </div>
            </ControlButton>
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