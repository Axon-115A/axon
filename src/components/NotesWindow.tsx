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

    // Check if user is signed in, throw error if not
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


    const body = new FormData(); // create a form to store the file
    body.append("file", file);
    const file_uid = uuidv4(); // generate a uuid to avoid filename collisions
    const { data, error } = await Login.supabase // upload file to user's own folder in storage bucket
        .storage
        .from('user_storage')
        .upload(`${user.id}/${file_uid}.png`, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) throw error;
    console.log(data)

    return `https://tugoremjbojyqanvwglz.supabase.co/storage/v1/object/public/user_storage/${user.id}/${file_uid}.png` // return url of the uploaded file
}


interface Props {
    onCloseWindow: () => void; //close window if exist button is clicked
    node: any // prompts the note window to open if node is clicked
}

//Notes Window actions and appearance.
const NotesWindow: React.FC<Props> = ({ onCloseWindow, node }) => {

    const [notesData, setNotes] = useState(node.data.notes ? JSON.parse(node.data.notes) as PartialBlock[] : undefined);

    //forces notesData to update whenever setNotes is called
    useEffect(() => {
        //console.log("setting notes", node, node.data.notes)
        if (node) setNotes(node.data.notes ? JSON.parse(node.data.notes) as PartialBlock[] : undefined);
    }, [node]);

    //Synchronizes the editor's content with the node.data.notes whenever the node or its notes data changes.
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

    const [panelHeight, setPanelHeight] = useState<number>(400); // Default height

    /*Resizing Feature */
    useEffect(() => {
        const panel = document.querySelector('.panel') as HTMLDivElement | null;
        
        const resizeHandle = document.querySelector('.resize-handle-top') as HTMLDivElement | null;
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;
    
        //When top area of notes bar is pulled down -> vertically reduce size of note panel
        const onMouseDown = (event: MouseEvent) => {
            if (!panel) return; // Ensure the panel exists
            isResizing = true;
            startY = event.clientY;
            startHeight = panel.offsetHeight; // Safe access due to typecast
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
    
        //Dynamically calculates and updates the panel's height while the user drags the resize handle.
        const onMouseMove = (event: MouseEvent) => {
            if (!isResizing || !panel) return; // Ensure resizing and panel exist
            const dy = startY - event.clientY; // Calculate movement difference
            const newHeight = Math.max(200, Math.min(800, startHeight + dy)); // Constrain height
            setPanelHeight(newHeight); // Update state with the new height
            panel.style.height = `${newHeight}px`; // Safe access due to typecast
        };
    
        //When top area of notes bar is pulled up -> vertically increase size of note panel
        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    
        //enables user interaction when the user clicks on the handle to start resizing
        resizeHandle?.addEventListener('mousedown', onMouseDown);
    
        return () => {
            resizeHandle?.removeEventListener('mousedown', onMouseDown);
        };
    }, []);

    //test code
    useEffect(() => {
        console.log('Panel height changed:', panelHeight);
    }, [panelHeight]);    

    //Initializes the BlockNote editor with the specified content and file upload logic
    const editor = useCreateBlockNote({
        initialContent: notesData || undefined,
        uploadFile: uploadFiles,
    });

    const onChange = async () => {
        // Converts the editor's contents from Block objects to Markdown and store to state.
        node.data.notes = JSON.stringify(editor.document); //updates the node data itself
    };

    return (
        <Panel position="bottom-right" className="panel">
            <div className="resize-handle-top" />
            <h3 className="notesTitle">{node.data.label}</h3>
            <button onClick={onCloseWindow} className="closeButton">
                <img src={CloseIcon} className="closeButtonIcon" />
            </button>

            {/* this style block is apparently the only way to dynammically change the blocknote window's max height  */}
            {/* inline styles don't work */}
            <style> 
                {`
                    .ProseMirror.bn-editor.bn-default-styles {
                        min-height: ${panelHeight - 50}px;
                    }
                `}
            </style>

            <BlockNoteView
                editor={editor}
                className="textBox" // Use the absolute positioning styles
                onChange={onChange}
                theme="dark"
            />
        </Panel>
            
    );
};

export default NotesWindow;