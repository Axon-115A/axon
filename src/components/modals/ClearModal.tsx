import React from 'react';
import { Modal, Button } from '@mantine/core';
import '../styles/ClearModal.css';

interface Props {
    opened: boolean,
    onClose: () => void;
    onConfirm: () => void;
}

const ClearModal: React.FC<Props> = ({ opened, onClose, onConfirm }) => (
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
            className='clearModal'
        >
            <div style={{textAlign: 'center'}}>
                <h2>Clear Canvas?</h2>
                <p>
                    <b>Are you sure you want to clear the canvas? This action cannot be undone.</b>
                </p>
            </div>
            <div className='clearButtonDiv'>
                <Button color="gray" onClick={onClose} className='clearModalButton clearModalCancelButton'>
                    Cancel
                </Button>
                <Button color="red" onClick={() => { onConfirm(); onClose(); }} className='clearModalButton'>
                    Clear
                </Button>
            </div>
        </Modal>
    </>
);

export default ClearModal;