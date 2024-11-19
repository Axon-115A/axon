//S: using: https://reactflow.dev/learn/customization/custom-edges
// https://reactflow.dev/examples/edges/markers
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSimpleBezierPath,
    useReactFlow,
    EdgeProps,
} from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
    data: {
        color: string;
    };
    // edgeLabel: string;
    // thickness: string;
    // texture: string; 
    // directionLeft: boolean;
    // directionRight: boolean;
}



export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data }: CustomEdgeProps): JSX.Element {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,

    });

    const edgeColor = data.color;

    //console.log(id, sourceX, sourceY, targetX, targetY, color)

    return (
        <>

            <BaseEdge id={id} path={edgePath} style={{ stroke: edgeColor }} />
            <EdgeLabelRenderer>
                <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                    uhou
                </div>
            </EdgeLabelRenderer>
        </>
    );
}