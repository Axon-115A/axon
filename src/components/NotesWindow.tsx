import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Panel } from '@xyflow/react';
import './styles/NotesWindow.css';

interface Props {
    onCloseWindow: () => void;
    node: any
}

const NotesWindow: React.FC<Props> = ({ onCloseWindow, node }) => {
    const [notesData, setNotes] = useState(node.data.data.notes);
    const [isEditing, setIsEditing] = useState(false); //Used to be: const [spellCheckEnabled, setSpellCheck] = useState(false);

    //forces notesData to update whenever setNotes is called
    useEffect(() => {
        if (node) setNotes(node.data.data.notes);
    }, [node]);

    const onNotesInput = (e: any) => {
        setNotes(e.target.value); //updates the display textbox
        node.data.data.notes = e.target.value; //updates the node data itself
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    return (
        <Panel position='bottom-left' className='panel'>
            <h3 className='notesTitle'>{node.data.label}</h3>
            <button onClick={onCloseWindow} className='closeButton'>
                <img src="src/assets/white_x.svg" className='closeButtonIcon' />
            </button>
            {isEditing ? (
                <textarea
                    value={notesData}
                    onChange={onNotesInput}
                    rows={20}
                    className='textBox'
                    onBlur={toggleEdit}
                    autoFocus

                /*
                //enable browser spell checking only when the box is selected
                spellCheck={spellCheckEnabled}
                onFocus={() => {setSpellCheck(true)}}
                onBlur={() => {setSpellCheck(false)}}
                */

                />
            ) : (
                <div
                    onClick={toggleEdit}
                    style={{
                        width: '100%',
                        height: '93%',
                        cursor: 'text',
                        marginTop: '-20px'
                    }}
                >
                    <ReactMarkdown>{notesData}</ReactMarkdown>
                </div>
            )}
        </Panel>
    );
};

export default NotesWindow;