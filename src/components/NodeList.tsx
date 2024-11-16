import React, { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button, Accordion } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { adaptTextColor } from '../App';
import './styles/NodeList.css';

interface Props {
    nodeList: any
}

const NodeList: React.FC<Props> = ({ nodeList }) => {
    const { setCenter } = useReactFlow();
    const [searchBarValue, setSearchBarValue] = useState('');

    
    const zoomToNode = useCallback((nodeData: any) => {
        setCenter(nodeData.position.x + 60, nodeData.position.y + 30, { duration: 800 });
    }, [setCenter]);


    const getButtonsFromNodes = (nodeList: any) => {
        const searchQuery = new RegExp(searchBarValue, "i")

        return Array.from(nodeList)
            .filter((node: any) => searchQuery.test(node.data.label))
            .map((node: any, index: any) => (
                <li key={index}>
                    <Button
                        onClick={() => { zoomToNode(node) }}
                        className='nodeListButton' color={node.data.backgroundColor}
                        style={{ color: adaptTextColor(node.data.backgroundColor) }}
                    >
                        {node.data.label}
                    </Button>
                </li>
            ));
    };


    
    const onSearchBarInput = (event: any) => {
        setSearchBarValue(event.currentTarget.value);
    }
    
    const magnifyingGlassSVG = (
        <img src="src/assets/magnifying-glass.svg" style={{width: '70%', height: '70%'}}></img>
    )

    return (
        <Accordion className="nodeAccordion">
            <Accordion.Item key={0} value={'0'}>
                <Accordion.Control>
                    All Nodes ({nodeList.length})
                </Accordion.Control>
                <Accordion.Panel>
                    <TextInput
                        className='nodeSearchBar'
                        placeholder='Search for a node...'
                        leftSection={magnifyingGlassSVG}
                        value={searchBarValue}
                        onChange={(event) => { onSearchBarInput(event) }}>
                    </TextInput>
                    <ul className='fullList'>{getButtonsFromNodes(nodeList)}</ul>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
};

export default NodeList;