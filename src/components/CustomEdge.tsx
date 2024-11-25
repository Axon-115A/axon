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

	let edgeStyle = {
		stroke: (selected) ? "#FFFFFF" : data.color,
		strokeWidth: thickness,
		strokeDasharray: texture,
	}
	if (selected) edgeStyle['filter'] = 'drop-shadow(0 0 3px white)';


	const TriangleMarker = ({ color = 'white', rotation = 0, id }) => {
		const size = 5;

		//the three coordinates of the triangle
		const p1 = { x: 0, y: 5 };
		const p2 = { x: 8, y: 5 };
		const p3 = { x: 4, y: 0 };	
		const pos = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
	
		//the centroid of the triangle (see https://en.wikipedia.org/wiki/Centroid?#Of_a_triangle) 
		//the svg will rotate around this point
		const centroid = {
			x: (p1.x + p2.x + p3.x) / 3,
			y: (p1.y + p2.y + p3.y) / 3
		};
		const transform = `rotate(${rotation} ${centroid.x} ${centroid.y})`;

		//the point at which the edge will connect to the marker
		//for no apparent reason whatsoever, these values are completely different depending on whether its a marker-start or marker-end
		//i absolutely love SVG rendering
		const ref = {
			x: (id == "triangleMarkerStart") ? 1 : 7,
			y: 3.5
		}
	
		return (
			<svg width={size} height={size} style={{ overflow: 'visible' }}>
				<defs>
					<marker
						id={id}
						markerWidth={size * 10}
						markerHeight={size * 10}
						refX={ref.x}
						refY={ref.y}
						orient="auto"
					>
						<polygon
							points={pos}
							fill={color}
							transform={transform}
						/>
					</marker>
				</defs>
			</svg>
		);
	};

	const getRotationFromDir = (direction: string) => {
		switch (direction) {
			case 'right': return 270;
			case 'bottom': return 180;
			case 'left': return 90;
			default: return 0;
		}
	}

	return (
		<>
			<TriangleMarker color={(selected) ? '#FFFFFF' : data.color} rotation={getRotationFromDir(sourcePosition)} id={`triangleMarkerStart`} />
			<TriangleMarker color={(selected) ? '#FFFFFF' : data.color} rotation={getRotationFromDir(targetPosition)} id={`triangleMarkerEnd`} />

			<BaseEdge id={id} path={edgePath} style={edgeStyle} markerStart='url(#triangleMarkerStart)' markerEnd='url(#triangleMarkerEnd)' />
			<EdgeLabelRenderer>
				<div
					style={{
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
					}}
					className="edge-label-renderer__custom-edge nodrag nopan"
				>
					{data.label}
					{/* <TriangleMarker /> */}
				</div>
			</EdgeLabelRenderer>
		</>
	);
}