import React from 'react';
// import { Panel } from '@xyflow/react';\
import { Modal, Button } from '@mantine/core';

interface Props {
    opened: boolean,
    onClose: () => void;
    onConfirm: () => void;
}

const ClearModal: React.FC<Props> = ({opened, onClose, onConfirm}) => (
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
        style = {{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Clear Canvas?</h2>
        <p style={{ textAlign: 'center' }}>
            <b>Are you sure you want to clear the canvas? This action cannot be undone.</b>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <Button color="gray" onClick={onClose} style={{ marginRight: '0.5rem', width: '100px', height: '40px' }}>
                Cancel
            </Button>
            <Button color="red" onClick={() => { onConfirm(); onClose(); }} style={{ width: '100px', height: '40px' }}>
                Clear
            </Button>
        </div>
    </Modal>
    </>
);
  
export default ClearModal;