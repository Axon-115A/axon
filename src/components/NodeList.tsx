import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button, Accordion } from '@mantine/core';
import './styles/NodeList.css';
import { adaptTextColor } from '../App';

interface Props {
    nodeList: any
}

const NodeList: React.FC<Props> = ({ nodeList }) => {
    const { setCenter } = useReactFlow();

    const zoomToNode = useCallback((nodeData: any) => {
        setCenter(nodeData.position.x + 60, nodeData.position.y + 30, { duration: 800 });
    }, [setCenter]);


    const nodesInList = nodeList.map((node: any, index: any) => (
        <li key={index}>
            <Button onClick={() => { zoomToNode(node) }} className='nodeListButton' color={node.data.backgroundColor} style={{color: adaptTextColor(node.data.backgroundColor ?? "#6c5ce7")}}>
                {node.data.label}
            </Button>
        </li>
    ))


    return (
        <Accordion className="nodeAccordion">
            <Accordion.Item key={0} value={'0'}>
                <Accordion.Control>
                    All Nodes ({nodeList.length})
                </Accordion.Control>
                <Accordion.Panel>
                    <ul className='fullList'>{nodesInList}</ul>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
};

export default NodeList;