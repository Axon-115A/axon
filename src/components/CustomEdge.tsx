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
        thickness: string; // 'thick' or 'default'
    };
    // edgeLabel: string;
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
    
    let thickness: number;
    if (data.thickness === 'default') {
        thickness = 1;
    } else if (data.thickness === 'thick') {
        thickness = 4;
    }else {
        thickness = 2; // fallback
    }

    //console.log(id, sourceX, sourceY, targetX, targetY, color)

    return (
        <>

            <BaseEdge id={id} path={edgePath} style={{ stroke: edgeColor, strokeWidth: thickness}} />
            <EdgeLabelRenderer>
                <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                    uhou
                </div>
            </EdgeLabelRenderer>
        </>
    );
}