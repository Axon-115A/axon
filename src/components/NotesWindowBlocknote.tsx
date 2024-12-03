import React, { useEffect, useState } from 'react';
import { Panel } from '@xyflow/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock } from '@blocknote/core';
import { v4 as uuidv4 } from 'uuid';
import { Login } from '../namespaces/Login';
import CloseIcon from '../assets/white_x.svg';
import './styles/NotesWindow.css';

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
async function uploadFiles(file: File) {

    async function checkUserSignedIn() {
        const { data: { user }, error } = await Login.supabase.auth.getUser();
        if (error) {
            console.error('Error fetching user:', error.message);
            return null;
        }

        return user; // Returns the user object if signed in, otherwise null
    }

    const user = await checkUserSignedIn();
    if (user === null) {
        throw "user not signed in";
    }


    const body = new FormData();
    body.append("file", file);
    const file_uid = uuidv4();
    const { data, error } = await Login.supabase
        .storage
        .from('user_storage')
        .upload(`public/${file_uid}.png`, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) throw error;
    console.log(data)

    return `https://tugoremjbojyqanvwglz.supabase.co/storage/v1/object/public/user_storage/public/${file_uid}.png`
}

interface Props {
    onCloseWindow: () => void;
    node: any
}

const NotesWindowBlocknote: React.FC<Props> = ({ onCloseWindow, node }) => {

    const [notesData, setNotes] = useState(node.data.notes ? JSON.parse(node.data.notes) as PartialBlock[] : undefined);
    // const [isEditing, setIsEditing] = useState(false); //Used to be: const [spellCheckEnabled, setSpellCheck] = useState(false);

    //forces notesData to update whenever setNotes is called
    useEffect(() => {
        //console.log("setting notes", node, node.data.notes)
        if (node) setNotes(node.data.notes ? JSON.parse(node.data.notes) as PartialBlock[] : undefined);
    }, [node]);

    useEffect(() => {
        if (node && node.data.notes) {
            const parsedNotes = JSON.parse(node.data.notes) as PartialBlock[];
            editor.replaceBlocks(editor.document, parsedNotes);
        } else if (node) {
            editor.replaceBlocks(editor.document, [
                {
                    type: "paragraph",
                    content: []
                }
            ]);
        }
    }, [node, node.data.notes]);
    // const onNotesInput = (e: any) => {
    //     setNotes(e.target.value); //updates the display textbox
    //     node.data.notes = e.target.value; //updates the node data itself
    // };

    // const toggleEdit = () => {
    //     setIsEditing(!isEditing);
    // };

    const editor = useCreateBlockNote({
        initialContent: notesData || undefined,
        uploadFile: uploadFiles,
    });

    const onChange = async () => {
        // Converts the editor's contents from Block objects to Markdown and store to state.
        node.data.notes = JSON.stringify(editor.document); //updates the node data itself
    };

    return (
        <Panel position='bottom-right' className='panel'>
            <h3 className='notesTitle'>{node.data.label}</h3>
            <button onClick={onCloseWindow} className='closeButton'>
                <img src={CloseIcon} className='closeButtonIcon' />
            </button>
            <div style={{ height: '350px' }}>
                <BlockNoteView
                    editor={editor}
                    style={{
                        // flex: 1 '350px', /* Ensures it stretches inside the panel */
                        overflowY: 'scroll',
                        height: '350px'

                    }}
                    onChange={onChange}
                    theme="dark"
                />
            </div>
        </Panel>
    );
};

export default NotesWindowBlocknote;