import React, { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button, Accordion, Checkbox, TextInput } from '@mantine/core';
import { ThemeManager } from '../namespaces/ThemeManager';
import MagnifyingGlass from '../assets/magnifying-glass.svg'
import './styles/NodeList.css';

interface Props {
    nodeList: any
}

const NodeList: React.FC<Props> = ({ nodeList }) => {
    const { setCenter } = useReactFlow();
    const [searchBarValue, setSearchBarValue] = useState('');
    const [includeNotes, setIncludeNotes] = useState(false);


    const zoomToNode = useCallback((nodeData: any) => {
        setCenter(nodeData.position.x + 60, nodeData.position.y + 30, { duration: 800 });
    }, [setCenter]);


    const getButtonsFromNodes = (nodeList: any) => {
        const searchQuery = new RegExp(searchBarValue, "i") //i flag makes the regex matching case insensitive

        return Array.from(nodeList)
            .filter((node: any) => {
                if (searchBarValue.length == 0) return true; //minor optimization, probably not needed

                const matchesLabel = searchQuery.test(node.data.label);
                const matchesNotes = (includeNotes) ? searchQuery.test(node.data.notes) : false;

                return matchesLabel || matchesNotes;
            })
            .map((node: any, index: any) => (
                <li key={index} className="li">
                    <Button
                        onClick={() => { zoomToNode(node) }}
                        className='nodeListButton' 
                        color={node.data.backgroundColor ?? ThemeManager.defaultNodeColor.value}
                        style={{ color: ThemeManager.adaptTextColor(node.data.backgroundColor) }}
                    >
                        <div style={{ fontSize: '0.85em' }}>
                            {node.data.label}
                        </div>
                    </Button>
                </li>
            ));
    };


    const magnifyingGlassSVG = (
        <img src={MagnifyingGlass} style={{ width: '70%', height: '70%' }}></img>
    )

    return (
        <Accordion className="nodeAccordion" style={{ backgroundColor: 'var(--node-list)' }}>
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
                        onChange={(event) => { setSearchBarValue(event.currentTarget.value) }}>
                    </TextInput>

                    <div className='includeNotesCheckbox'>
                        <Checkbox
                            label="Search within notes"
                            checked={includeNotes}
                            onChange={(event) => { setIncludeNotes(event.currentTarget.checked) }}
                        />
                    </div>

                    <ul className='fullList'>{getButtonsFromNodes(nodeList)}</ul>
                </Accordion.Panel>

            </Accordion.Item>
        </Accordion>
    )
};

export default NodeList;