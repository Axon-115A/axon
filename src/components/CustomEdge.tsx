import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    EdgeProps,
    MarkerType
} from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
    data: {
        color: string;
        thickness: string; // 'thick' or 'default'
        texture: string;
        label: string;
    };
    //markerEnd?: EdgeMarker;
    //markerStart?: EdgeMarker;
}

export default function CustomEdge({ id, sourceX, sourceY, sourcePosition, targetPosition, targetX, targetY, data, markerEnd, markerStart }: CustomEdgeProps): JSX.Element {
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
        case 'default':
            thickness = 1;
            break;
        case 'thick':
            thickness = 4;
            break;
        default:
            thickness = 2;
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

    const edgeStyle = {
        stroke: data.color,
        strokeWidth: thickness,
        strokeDasharray: texture
    }

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerStart={MarkerType.ArrowClosed} markerEnd={MarkerType.ArrowClosed} style={edgeStyle} />
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