import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	EdgeProps,
} from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
	data: {
		color: string;
		thickness: string; // 'thick' or 'default'
		texture: string;
		label: string;
		startArrowVisible: boolean;
		endArrowVisible: boolean;
	};
	// EdgeProps already include selected, so you don't need to add it manually.
	//markerEnd?: EdgeMarker;
	//markerStart?: EdgeMarker;
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
			texture = '10 10';
			break;
		case 'dotted':
			texture = (data.thickness === 'thick') ? '5 5' : '1 5';
			break;
		default: //solid
			texture = '0';
			break;
	}

	let edgeStyle: React.CSSProperties = {
		stroke: (selected) ? '#FFFFFF' : data.color,
		strokeWidth: thickness,
		strokeDasharray: texture,
	}
	if (selected) edgeStyle['filter'] = 'drop-shadow(0 0 3px white)';

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
					}}
					className="edge-label-renderer__custom-edge nodrag nopan"
				>
					{data.label}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}