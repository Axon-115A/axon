import React from 'react';
import { Panel } from '@xyflow/react';
import './NotesWindow.css';


interface Props {
    onCloseWindow: () => void;
    nodeName: string;
    notes: string;
}

const NotesWindow: React.FC<Props> = ({ onCloseWindow, nodeName, notes }) => (
    <Panel position='bottom-left' className='panel'>
        <h3 className='notesTitle'>{nodeName}</h3>
        <button onClick={onCloseWindow} className='closeButton'>
            <span className='closeButtonText'>╳</span>
        </button>
        <p>{notes}</p>
    </Panel>
);

export default NotesWindow;