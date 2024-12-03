import { Handle, Position } from '@xyflow/react';
import './styles/Handles.css';
import './styles/NodeShapes.css';
import { ThemeManager } from '../namespaces/ThemeManager';

// Custom node component to render as a rectangle
const CustomNode = ({ data, selected }: any) => {
	let selectionStyle : React.CSSProperties = {
		outline: `2px solid #81ECEC`,
		outlineOffset: '-2px',
		borderRadius: (data.shape == 'rect') ? '5px' : '50%'
	}

	if (selected) {
		const shadowColor = ThemeManager.getCurrentTheme() == 'light' ? 'black' : 'white';
		selectionStyle['boxShadow'] = `0 0 5px 0px ${shadowColor}`;
	}

	return (
		<div className={data.shape} style={{
			backgroundColor: data.backgroundColor ?? ThemeManager.defaultNodeColor.value,
			...(selected ? selectionStyle : {})
		}}>
			<div style={{
				textAlign: 'center',
				width: '100%',
				color: ThemeManager.adaptTextColor(data.backgroundColor)
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