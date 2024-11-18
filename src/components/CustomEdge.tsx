//S: using: https://reactflow.dev/learn/customization/custom-edges
// https://reactflow.dev/examples/edges/markers
import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
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



export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data }: CustomEdgeProps) {
    //const { color } = data; // Destructure color from data
    console.log(data);
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,

    });

//console.log(id, sourceX, sourceY, targetX, targetY, color)

    return (
        <>
            
            <BaseEdge id={id} path={edgePath} style={{stroke: data.color}} />
            <EdgeLabelRenderer>
                uhou
            </EdgeLabelRenderer>
        </>
    );
}