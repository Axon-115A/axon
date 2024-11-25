import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Panel } from '@xyflow/react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { Editor, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
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
        setIsEditing(!isEditing);
    };

    return (
        <Panel position='bottom-right' className='panel'>
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
                    className="textBoxMarkdownDiv"
                >
                    <ReactMarkdown>{notesData}</ReactMarkdown>
                </div>
            )}
        </Panel>
    );
};

const NotesWindowMantine: React.FC<Props> = ({ onCloseWindow, node }) => {
    const [notesData, setNotes] = useState(node.data.data.notes);
    // const [isEditing, setIsEditing] = useState(false); //Used to be: const [spellCheckEnabled, setSpellCheck] = useState(false);

    //forces notesData to update whenever setNotes is called
    useEffect(() => {
        if (node) setNotes(node.data.data.notes);
    }, [node]);

    const onNotesInput = (e: any) => {
        setNotes(e.target.value); //updates the display textbox
        node.data.data.notes = e.target.value; //updates the node data itself
    };

    // const toggleEdit = () => {
    //     setIsEditing(!isEditing);
    // };

    const content = node.data.data.notes;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
    });

    // editor.on('update', ({ editor }) => {
    //     // The content has changed.
    //     setNotes(editor.getText)
    // })

    const editorContainerStyle = {
        height: '350px',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
    };

    const editorStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        '& .mantine-RichTextEditor-content': {
            flex: 1,
            overflowY: 'auto' as const,
            padding: '1rem'
        },
    };

    useEffect(() => {
        if (editor) {
            // Listen to updates on the editor
            editor.on('update', ({ editor }) => {
            const newContent = editor?.getText(); // Safely access getText
            if (newContent !== undefined) {
                setNotes(newContent); // Update the local state
                node.data.data.notes = newContent; // Update the node data
            }
            });
        }
    }, [editor, node]); // Make sure editor and node are dependencies
    
    return (
        <Panel position='bottom-right' className='panel'>
           <h3 className='notesTitle'>{node.data.label}</h3>
            <button onClick={onCloseWindow} className='closeButton'>
                 <img src="src/assets/white_x.svg" className='closeButtonIcon' />
            </button>
            {true ? (
                <div style={editorContainerStyle}>
                    <RichTextEditor editor={editor} styles={{ content: { height: 300, overflowY: 'auto' } }}>
                        <RichTextEditor.Toolbar>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                
                        <RichTextEditor.Content />
                </RichTextEditor>       
              </div>   
            ) : (
                <div
                    // onClick={toggleEdit}
                    className="textBoxMarkdownDiv"
                >
                    <ReactMarkdown>{notesData}</ReactMarkdown>
                </div>
            )}
        </Panel>
    );
};


export default NotesWindowMantine;