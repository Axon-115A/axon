import React from 'react';
// import { Panel } from '@xyflow/react';\
import { Modal, Button } from '@mantine/core';

interface Props {
    opened: boolean,
    onClose: () => void;
}

const HelpModal: React.FC<Props> = ({opened, onClose}) => (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        // title="Help"
        size="lg"
        // centered
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Help</h2>
        <ul>
            <li>Double-click the left mouse button to create a node.</li>
            <li>Select nodes by left-clicking them once.</li>
            <li>Delete nodes and edges by selecting them and pressing the delete key.</li>
            <li>Connect nodes by clicking on an open edge and dragging it to another node.</li>
            <li>Change the title and shape of a node by right-clicking it.</li>
            <li>Use the controls on the bottom left for zooming, recentering, and locking.</li>
        </ul>
        <Button 
            variant="filled" 
            color="teal" 
            onClick={onClose}
            style={{
                left: '50%',  // Center the button horizontally
                transform: 'translateX(-50%)',  // Offset by half of its width to align in center
                padding: '10px 20px',
                fontSize: '16px',
                // border: '2px solid #2c2c2c',
            }}
        >
            I Understand
        </Button>
    </Modal>
    </>
);
  
export default HelpModal;