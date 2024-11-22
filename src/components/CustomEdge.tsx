import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    EdgeProps,
} from '@xyflow/react';


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
    //markerEnd?: EdgeMarker;
    //markerStart?: EdgeMarker;
}

export default function CustomEdge({ id, sourceX, sourceY, sourcePosition, targetPosition, targetX, targetY, data, markerEnd, markerStart }: CustomEdgeProps): JSX.Element {
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

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerStart={markerStart} markerEnd={markerEnd} style={edgeStyle} />
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