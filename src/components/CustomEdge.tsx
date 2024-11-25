import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	EdgeProps,
	useReactFlow
} from '@xyflow/react';

import React from 'react';


export const getSpecialPath = ({ sourceX, sourceY, targetX, targetY }, offset: number) => {
	const centerX = (sourceX + targetX) / 2;
	const centerY = (sourceY + targetY) / 2;

	return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
};

export const getCubicBezierPath = ({ sourceX, sourceY, targetX, targetY }, offset: number) => {
	const controlX1 = sourceX + offset;
	const controlY1 = sourceY + offset;

	const controlX2 = targetX - offset;
	const controlY2 = targetY - offset;

	// Return the cubic Bezier path string
	return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
};


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
	let thickness: number;
	switch (data.thickness) {
		case 'thick':
			thickness = 4;
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


	//built in cubic bezier path
	//looks the best, but doesnt rotate arrow heads for some reason
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	//quadratic bezier path
	//rotates arrowheads, but looks awful
	const quadraticBezier = getSpecialPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	}, sourceX < targetX ? 25 : -25);


	//cubic bezier path
	//too curvy for some reason, rotates arrowheads
	const badCubicPath = getCubicBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	}, sourceX < targetX ? 25 : -25)

	// console.log(markerStart, markerEnd)

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

		const ref = {
			x: 1,
			y: 3.5
		}
		
		if (id == "triangleMarkerEnd") {
			ref.x = 7;
			ref.y = 3.5;
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

	console.log(sourcePosition, sourceX, sourceY, labelX, labelY)

	return (
		<>
			<TriangleMarker color={"#FFFFFF"} rotation={getRotationFromDir(sourcePosition)} id="triangleMarkerStart" />
			<TriangleMarker color={"#FFFFFF"} rotation={getRotationFromDir(targetPosition)} id="triangleMarkerEnd" />

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