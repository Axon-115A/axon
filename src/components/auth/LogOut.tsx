import React from 'react';
// import { Panel } from '@xyflow/react';\
import { Modal, Button } from '@mantine/core';

interface Props {
    opened: boolean,
    onClose: () => void;
    onConfirm: () => void;
}

const LogOutModal: React.FC<Props> = ({opened, onClose, onConfirm}) => (
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
        <h2 style={{ textAlign: 'center' }}>Log Out</h2>
        <p style={{ textAlign: 'center' }}>
            Are you sure you want to log out?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button color="gray" onClick={onClose} style={{ marginRight: '0.5rem', width: '100px', height: '40px' }}>
                Cancel
            </Button>
            <Button color="red" onClick={() => { onConfirm(); onClose(); }} style={{ width: '100px', height: '40px' }}>
                Log Out
            </Button>
        </div>
    </Modal>
    </>
);
  
export default LogOutModal;