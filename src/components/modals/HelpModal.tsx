import React from 'react';
import { Modal, Button } from '@mantine/core';
import '../styles/HelpModal.css';
import { ThemeManager } from '../../namespaces/ThemeManager';

interface Props {
    opened: boolean;
    onClose: () => void;
}

// Mantine modal created by Nikolas, this modal appears when the help button is pressed, and displays the controls to the user.

const HelpModal: React.FC<Props> = ({ opened, onClose }) => {
    const modalBackgroundColor = ThemeManager.defaultNodeColor.value; // Get the current theme's background color

    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                size="lg"
                centered
                withCloseButton={false}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                className="helpModal"
                styles={{
                    content: {
                        backgroundColor: modalBackgroundColor,
                    },
                }}
            >
                <h2 style={{ textAlign: 'center' }}>Help</h2>
                <ul>
                    <li>Double-click the left mouse button to create a node.</li>
                    <li>Select nodes by left-clicking them once.</li>
                    <li>Delete nodes and edges by selecting them and pressing the delete key.</li>
                    <li>Connect nodes by clicking on an open edge and dragging it to another node.</li>
                    <li>Change the title and shape of a node by right-clicking it.</li>
                    <li>Use the controls on the bottom right for zooming, recentering, and locking.</li>
                </ul>
                <Button
                    variant="filled"
                    color="teal"
                    onClick={onClose}
                    style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        fontSize: '16px',
                    }}
                >
                    OK
                </Button>
            </Modal>
        </>
    );
};

export default HelpModal;
