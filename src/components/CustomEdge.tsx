//S: using: https://reactflow.dev/learn/customization/custom-edges
// https://reactflow.dev/examples/edges/markers
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSimpleBezierPath,
    getBezierPath,
    useReactFlow,
    EdgeProps,
    EdgeMarker,
    MarkerType
} from '@xyflow/react';

//import { MarkerType } from 'reactflow';
import '../index.css';
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
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const edgeColor = data.color;
    const labelText = data.label;

    let thickness: number;
    if (data.thickness === 'default') {
        thickness = 1;
    } else if (data.thickness === 'thick') {
        thickness = 4;
    } else {
        thickness = 2; // fallback
    }

    let texture: string;
    if (data.texture === 'solid') {
        texture = '0';
    } else if (data.texture === 'dashed') {
        texture = '10 10';
    } else if (data.texture === 'dotted') {
        if (data.thickness === 'thick') {
            texture = '5 5';
        } else {
            texture = '1 5';
        }

    }

    //console.log({ markerStart, markerEnd });

    //console.log(id, sourceX, sourceY, targetX, targetY, color)

    return (
        <>

            <BaseEdge id={id} path={edgePath} markerStart={MarkerType.ArrowClosed} markerEnd={MarkerType.ArrowClosed} style={{ stroke: edgeColor, strokeWidth: thickness, strokeDasharray: texture }} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    className="edge-label-renderer__custom-edge nodrag nopan"
                >
                    {labelText}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}