// components/EditLabelModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, ColorPicker, ColorInput } from '@mantine/core';
import '../styles/ColorPickerModal.css';

interface ColorPickerModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: (color: string, isNode: boolean) => void;
    initialColor: string;
    isForNode: boolean; // this is for differentiating between edge and node for colorpicker
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ opened, onClose, onConfirm, initialColor, isForNode }) => {
    const [selectedColor, setSelectedColor] = useState(initialColor);

    useEffect(() => {
        if (opened) {
            setSelectedColor(initialColor);
        }
    }, [opened, initialColor]);

    const handleSubmit = () => {
        onConfirm(selectedColor, isForNode);
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
            className='colorPickerModal'
        >
            <div className='primaryDiv'>
                <ColorPicker
                    format="hex"
                    value={selectedColor}
                    onChange={(newColor) => setSelectedColor(newColor)}
                    onKeyDown={handleKeyPress}
                    swatches={[
                        '#fa5252', '#fab005', '#40c057', '#228be6', '#2e2e2e'
                    ]}
                    swatchesPerRow={8}
                    styles={{
                        swatch: {
                            width: '15px',
                            height: '10px',
                            margin: '4px',
                            left: '5px'
                        },
                    }}
                    className="colorPicker"
                />
                <ColorInput
                    value={selectedColor}
                    withPicker={false}
                    placeholder="Enter value"
                    withEyeDropper={false}
                    onChange={(newColor) => setSelectedColor(newColor)}
                    onKeyDown={handleKeyPress}
                // fixOnBlur={false}
                />
                <div className='colorPickerButtonDiv'>
                    <Button color="gray" onClick={onClose} className='colorPickerButton colorPickerCancelButton'>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className='colorPickerButton'>
                        Submit
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ColorPickerModal;
