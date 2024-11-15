import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css'
import './styles/NodeShapes.css'

function luminanceFromRGB(hex: string) {
    //remove # from hex string
    hex = hex.replace(/^#/, '');
    
    //convert to normal base 10 integer
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    //from https://en.wikipedia.org/w/index.php?title=Relative_luminance#Relative_luminance_and_%22gamma_encoded%22_colorspaces
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Custom node component to render as a rectangle
const RectNode = ({ data }: any) => {
    if (!data.backgroundColor) {
        console.log(`${data.label} is undefined`)
        console.log(data)
    }

    return (
        <div className="rect" style={{ background: data.backgroundColor }}>
            <div style={{ color: luminanceFromRGB(data.backgroundColor) < 128 ? 'white' : 'black' }}>
                {data.label}
            </div>
            <Handle type="source" position={Position.Top} id="top" />
            <Handle type="source" position={Position.Left} id="left" />
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
    );
};
export default RectNode;