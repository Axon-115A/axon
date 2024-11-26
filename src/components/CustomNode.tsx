import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css';
import './styles/NodeShapes.css';
import { adaptTextColor } from '../Utilities';

// Custom node component to render as a rectangle
const CustomNode = ({ data, selected }: any) => {
	const outlineColor = "#81ECEC";
	let selectionStyle = {
		outline: `2px solid ${outlineColor}`,
		outlineOffset: '-2px',
		borderRadius: (data.shape == 'rect') ? '5px' : '50%'
	}

	return (
		<div className={data.shape} style={{
			backgroundColor: data.backgroundColor,
			...(selected ? selectionStyle : {})
		}}>
			<div style={{
				textAlign: 'center',
				width: '100%',
				color: adaptTextColor(data.backgroundColor)
			}}>
				{data.label}
			</div>

			<Handle type="source" position={Position.Top} id="top" />
			<Handle type="source" position={Position.Left} id="left" />
			<Handle type="source" position={Position.Right} id="right" />
			<Handle type="source" position={Position.Bottom} id="bottom" />
		</div>
	);
};

export default CustomNode;