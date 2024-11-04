import React, {useEffect, useState} from 'react';
import { Panel } from '@xyflow/react';
import './styles/NotesWindow.css';
import './save/Save';


interface Props {
    onCloseWindow: () => void;
    node: any

    // for setNodes to be available in NotesWindow to update node state
    setNodes: (updateFn: (nodes: any[]) => any[]) => void;
}

const NotesWindow: React.FC<Props> = ({ onCloseWindow, node, setNodes }) => {
    const [notesData, setNotes] = useState(node.data.data.notes);
    const [spellCheckEnabled, setSpellCheck] = useState(false);

    //forces notesData to update whenever setNotes is called
    useEffect(() => {
        if (node) setNotes(node.data.data.notes);
    }, [node]);

    const onNotesInput = (e: any) => {
        setNotes(e.target.value); //updates the display textbox
        node.data.data.notes = e.target.value; //updates the node data itself

        // need to implement setNodes funciton because isNew update doesn't persist in App.tsx. 
        setNodes((nodes) =>
            nodes.map((n) => {
                if (n.id === node.id) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            data: {
                                ...n.data.data,
                                notes:  e.target.value,
                            },
                        },
                        isNew: false, // Mark as updated
                    };
                }
                return n;
            })
        );
    };


    return (
        <Panel position='bottom-left' className='panel'>
            <h3 className='notesTitle'>{node.data.label}</h3>
            <button onClick={onCloseWindow} className='closeButton'>
                {/* <span className='closeButtonText'>╳</span> */}
                <img src="src/assets/white_x.svg" className='closeButtonIcon'/>
            </button>
            <textarea
                value={notesData}
                onChange={onNotesInput}
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