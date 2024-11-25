import React, { useEffect, useState } from 'react';
import { Panel } from '@xyflow/react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
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
    const [notesData, setNotes] = useState(node.data.notes);

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
        content: notesData,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setNotes(html);
            node.data.notes = html;
        },
    });

    //forces notesData to update whenever setNotes is called
    useEffect(() => {
        if (editor && node) {
            editor.commands.setContent(node.data.notes || '');
        }
    }, [node, editor]);

    return (
        <Panel position='bottom-right' className='panel'>
            <h3 className='notesTitle'>{node.data.label}</h3>
            <button onClick={onCloseWindow} className='closeButton'>
                <img src="src/assets/white_x.svg" className='closeButtonIcon' />
            </button>
            <RichTextEditor editor={editor} className="small-toolbar">
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Undo />
                        <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>


                </RichTextEditor.Toolbar>

                {/* Scrollable container */}
                <div className="scrollable-content">
                    <RichTextEditor.Content />
                </div>
            </RichTextEditor>
        </Panel>
    );
};

export default NotesWindow;