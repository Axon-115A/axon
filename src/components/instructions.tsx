import React from 'react';
import { Panel } from '@xyflow/react';


interface Props {
    onConfirm: () => void;
  }
  
const InstructionsBox: React.FC<Props> = ({ onConfirm }) => (
    <Panel position="top-center" style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid gray' }}>
        <h3 style={{ textAlign: 'center', display: 'block', margin: 'auto'}}>Instructions</h3>
        <p>1. Double-left click to create a node.</p>
        <p>2. Highlight nodes by left clicking them once.</p>
        <p>3. Delete nodes by highlighting them, and then using the delete key.</p>
        <p>4. Connect nodes by clicking on an open edge, and dragging it to another node.</p>
        <p>5. Use the controls on the bottom left for zooming, recentering, and locking.</p>
        <button onClick={onConfirm} style={{ textAlign: 'center', display: 'block', margin: 'auto', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Confirm
        </button>
    </Panel>
);
  
export default InstructionsBox;