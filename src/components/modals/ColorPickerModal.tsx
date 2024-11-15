// components/EditLabelModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, ColorPicker } from '@mantine/core';

interface ColorPickerModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: (color: string) => void;
    initialColor: string;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ opened, onClose, onConfirm, initialColor }) => {
    const [selectedColor, setSelectedColor] = useState(initialColor);

    useEffect(() => {
        if (opened) {
            setSelectedColor(initialColor);
        }
    }, [opened, initialColor]);

    const handleSubmit = () => {
        onConfirm(selectedColor);
        onClose();
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
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <ColorPicker
                format="hex"
                value={selectedColor}
                onChange={setSelectedColor}
                swatches={[
                    '#fa5252', '#fab005', '#40c057', '#228be6', '#2e2e2e'
                ]}
                swatchesPerRow={10}
                styles={{
                  swatch: {
                    width: '20px',
                    height: '20px',
                    margin: '4px', 
                  },
                }}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button color="gray" onClick={onClose} style={{ marginRight: '0.5rem', width: '100px' }}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} style={{ width: '100px' }}>
                    Submit
                </Button>
            </div>
        </div>
        </Modal>
    );
};

export default ColorPickerModal;
