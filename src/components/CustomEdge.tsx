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
    //const { color } = data; // Destructure color from data
    console.log(data);
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,

    });

    const edgeColor = data?.color || '#FFF';

//console.log(id, sourceX, sourceY, targetX, targetY, color)

    return (
        <>
            
            <BaseEdge id={id} path={edgePath} style={{stroke: edgeColor}} />
            <EdgeLabelRenderer>
                <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                    uhou
                </div>
            </EdgeLabelRenderer>
        </>
    );
}


// const CircleNode = ({ data }: any) => {
// 	return (
// 		<div className="circle" style={{background: data.backgroundColor}}>
// 			<div style={{
// 				textAlign: 'center',
// 				width: '100%',
// 				color: adaptTextColor(data.backgroundColor ?? "#6c5ce7")
// 			}}>
// 				{data.label}
// 			</div>
			
// 			<Handle type="source" position={Position.Top} id="top" /> 
// 			<Handle type="source" position={Position.Left}  id="left" /> 
// 			<Handle type="source" position={Position.Right} id="right" /> 
// 			<Handle type="source" position={Position.Bottom}  id="bottom" /> 
// 		</div>
// 	);
// };

// export default CircleNode;
