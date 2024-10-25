import React, {useState} from 'react';
import { Panel } from '@xyflow/react';
import './NotesWindow.css';


interface Props {
    onCloseWindow: () => void;
    nodeName: string;
    notes: string;
}

const NotesWindow: React.FC<Props> = ({ onCloseWindow, nodeName, notes }) => {
    const [isNotes, setNotes] = useState(notes);
    const [spellCheckEnabled, setSpellCheck] = useState(false);

    return (
        <Panel position='bottom-left' className='panel'>
            <h3 className='notesTitle'>{nodeName}</h3>
            <button onClick={onCloseWindow} className='closeButton'>
                <span className='closeButtonText'>╳</span>
            </button>
            <textarea
                value={isNotes}
                onChange={(e) => setNotes(e.target.value)}
                rows={20}
                className='textBox'

                //enable browser spell checking only when the box is selected
                spellCheck={spellCheckEnabled}
                onFocus={() => {setSpellCheck(true)}}
                onBlur={() => {setSpellCheck(false)}}
            />
        </Panel>
    )
};

export default NotesWindow;