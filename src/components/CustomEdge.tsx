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
        texture: string;
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

    let texture: string;
    if (data.texture === 'solid') {
        texture = '0';
    } else if (data.texture === 'dashed') {
        texture = '10 5'
    }else if (data.texture === 'dotted'){
        if (data.thickness === 'thick'){
            texture = '5 5'
        } else {
            texture = '1 5'
        }
        
    }
    


    //console.log(id, sourceX, sourceY, targetX, targetY, color)

    return (
        <>

            <BaseEdge id={id} path={edgePath} style={{ stroke: edgeColor, strokeWidth: thickness, strokeDasharray: texture}} />
            <EdgeLabelRenderer>
                <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                    uhou
                </div>
            </EdgeLabelRenderer>
        </>
    );
}