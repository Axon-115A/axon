import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	EdgeProps,
} from '@xyflow/react';
import { ThemeManager } from '../namespaces/ThemeManager';

interface CustomEdgeProps extends EdgeProps {
	data: {
		color: string;
		thickness: string; // 'thick' or 'default'
		texture: string;
		label: string;
		startArrowVisible: boolean;
		endArrowVisible: boolean;
	};
}

export default function CustomEdge({ id, selected, sourceX, sourceY, sourcePosition, targetPosition, targetX, targetY, data, markerEnd, markerStart }: CustomEdgeProps): JSX.Element {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	let thickness: number;
	switch (data.thickness) {
		case 'thick':
			thickness = 2;
			break;
		default:
			thickness = 1;
			break;
	}

	let texture: string;
	switch (data.texture) {
		case 'dashed':
			texture = (data.thickness === 'thick') ? '7 3.5' : '5 5';
			break;
		case 'dotted':
			texture = (data.thickness === 'thick') ? '2 3' : '1 4';
			break;
		default: //solid
			texture = '0';
			break;
	}

	const edgeStyle: React.CSSProperties = {
		stroke: (selected) ? '#81ecec' : data.color,
		strokeWidth: thickness,
		strokeDasharray: texture,
	}		
	if (selected) {
		const shadowColor = ThemeManager.getCurrentTheme() == 'light' ? 'black' : 'white';
		edgeStyle['filter'] = `drop-shadow(0 0 3px ${shadowColor})`;
	}

	return (
		<>
			<BaseEdge 
				id={id} 
				path={edgePath} 
				style={edgeStyle} 
				markerStart={(data.startArrowVisible) ? markerStart : undefined} 
				markerEnd={(data.endArrowVisible) ? markerEnd : undefined}
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						color: ThemeManager.getCurrentTheme() == 'dark' ? '#c9c9c9': '#5C5C5C'
					}}
					className="edge-label-renderer__custom-edge nodrag nopan"
				>
					{data.label}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}