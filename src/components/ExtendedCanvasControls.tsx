import { Controls, ControlButton } from '@xyflow/react';
import { ThemeManager } from '../namespaces/ThemeManager';
import TrashIcon from './../assets/trash.svg';
import SaveIcon from './../assets/floppy.svg';
import QuestionIcon from './../assets/question-circle.svg';
import ThemeIcon from './../assets/toggleTheme.svg';

interface ExtendedCanvasControlsProps {
    clearCanvas: () => void;
    position: any;
    helpHandler: { open: () => void };
}

// Nikolas added the clear and help buttons here.

const ExtendedCanvasControls: React.FC<ExtendedCanvasControlsProps> = ({ clearCanvas, position, helpHandler }) => {
    //todo: find a better way to force color scheme on the canvas controls
    document.documentElement.style.setProperty('--xy-controls-button-background-color', 'var(--canvas-controls)');

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
            <ControlButton onClick={() => {ThemeManager.toggleTheme()}} title={`Switch to ${ThemeManager.getCurrentTheme() == 'light' ? 'dark' : 'light'} theme`}>
                <div>
                    <img src={ThemeIcon} />
                </div>
            </ControlButton>
        </Controls>
    )
}

export default ExtendedCanvasControls;