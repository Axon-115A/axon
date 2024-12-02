// components/EditLabelModal.tsx
import React, { useEffect } from 'react';
import { Modal, TextInput, Button } from '@mantine/core';
import '../styles/EditLabelModel.css';

interface EditLabelModalProps {
    opened: boolean;
    label: string;
    onClose: () => void;
    onConfirm: (newLabel: string, isNode: boolean) => void;
    isForNode: boolean;
}

const EditLabelModal: React.FC<EditLabelModalProps> = ({ opened, label, onClose, onConfirm, isForNode }) => {
    const [newLabel, setNewLabel] = React.useState(label);

    useEffect(() => {
        if (opened) {
            setNewLabel(label);
        }
    }, [opened, label]);

    const truncateLabel = (label: string): string =>
        label.length > 30 ? label.substring(0, 30) : label;

    const handleSubmit = () => {
        onConfirm(truncateLabel(newLabel), isForNode);
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
            className='editModal'
        >
            <div className='textInputDiv'>
                <TextInput
                    label="Enter new node label below."
                    value={newLabel}
                    onChange={(event) => setNewLabel(event.currentTarget.value)}
                    onKeyDown={handleKeyPress}
                    className='textInput'
                    maxLength={30}
                />
            </div>
            <div className="buttonDiv">
                <Button color="gray" onClick={onClose} className='modalButton cancelButton'>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} className='modalButton'>
                    Submit
                </Button>
            </div>
        </Modal>
    );
};

export default EditLabelModal;
