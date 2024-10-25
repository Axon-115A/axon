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
        title="Help"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <p>1. Double-click the left mouse button to create a node.</p>
        <p>2. Select nodes by left clicking them once.</p>
        <p>3. Delete nodes and edges by selecting them and pressing the delete key.</p>
        <p>4. Connect nodes by clicking on an open edge and dragging it to another node.</p>
        <p>5. Change the title and shape of a node by right clicking it.</p>
        <p>6. Use the controls on the bottom left for zooming, recentering, and locking.</p>
        <Button 
            variant="filled" 
            color="teal" 
            onClick={onClose}
            style={{
                left: '50%',  // Center the button horizontally
                transform: 'translateX(-50%)',  // Offset by half of its width to align in center
                // padding: '10px 20px',
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