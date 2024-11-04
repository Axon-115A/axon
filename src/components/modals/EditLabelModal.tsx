// components/EditLabelModal.tsx
import React, { useEffect } from 'react';
import { Modal, TextInput, Button } from '@mantine/core';

interface EditLabelModalProps {
    opened: boolean;
    label: string;
    onClose: () => void;
    onConfirm: (newLabel: string) => void;
}

const EditLabelModal: React.FC<EditLabelModalProps> = ({ opened, label, onClose, onConfirm }) => {
    const [newLabel, setNewLabel] = React.useState(label);

    useEffect(() => {
        if (opened) {
            setNewLabel(label);
        }
    }, [opened, label]);

    const handleSubmit = () => {
        onConfirm(newLabel);
        onClose();
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Modal 
            opened={opened} 
            onClose={onClose} 
            size="sm"
            centered
            withCloseButton={false}
            overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
            }}
            style = {{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextInput
                    label="Enter new node label below."
                    value={newLabel}
                    onChange={(event) => setNewLabel(event.currentTarget.value)}
                    onKeyDown={handleKeyPress}
                    style={{ textAlign: 'center', width: '200px', alignItems: 'center', justifyContent: 'center' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "0.5rem"}}>
                <Button color="gray" onClick={onClose} style={{ marginRight: '0.5rem', width: '100px', height: '40px' }}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} style={{ width: '100px', height: '40px' }}>
                    Submit
                </Button>
            </div>
        </Modal>
    );
};

export default EditLabelModal;
