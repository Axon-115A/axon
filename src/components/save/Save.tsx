import React from 'react';
// import { Panel } from '@xyflow/react';\
import { Modal, Button } from '@mantine/core';


// maybe remove this from App.tsx? 
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = "https://tugoremjbojyqanvwglz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z29yZW1qYm9qeXFhbnZ3Z2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MTk2ODgsImV4cCI6MjA0Mzk5NTY4OH0.RvmWr4VrQ0ioRR34vpGYeBEz8qFOPh68ZURNf41yhts"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

//CREATE
export const AddNodeToDatabase = async (node: any) => {
	const { data, error } = await supabase
		.from('NodeTable')
		.insert([
			{ 
				id: node.id, 
				label: node.data.label, 
				notes: node.data.data.notes,
				type: node.type, // 'circle' or 'rect' 
				position_x: node.position.x,
				position_y: node.position.y
			},
		]);
		if (error) {
			console.error("Error inserting node:", error);
		} else {
			console.log("Node inserted successfully:", data);
		}
};




export const FetchNodesFromDatabase = async () => {
	const { data: NodeTable, error } = await supabase
		.from('NodeTable')
		.select('*');

	if (error) {
		console.error("Error fetching nodes:", error);
		return [];
	}

	return NodeTable?.map((node: any) => ({
		id: node.id,
		position: { x: node.position_x, y: node.position_y },
		data: { label: node.label, data: { notes: node.notes } },
		type: node.type,
	}));
};


export const UpdateNodeInDatabase = async (node: any) => {
	const { data, error } = await supabase
	  	.from('NodeTable')
	  	.update(
			{ 
				label: node.data.label, 
				notes: node.data.data.notes,
				type: node.type,
				position_x: node.position.x,
				position_y: node.position.y
	  		}
		)
	  	.eq('id', node.id);
		//.select() supabase currently doesn't support this, but it's fine, this merely returns the thing you just did. 
  
	if (error) console.error("Error updating node:", error);
};


// DELETE
export const DeleteNodeFromDatabase = async (nodeId: string) => {
	const { error } = await supabase
	  .from('NodeTable')
	  .delete()
	  .eq('id', nodeId);
  
	if (error) console.error("Error deleting node:", error);
  };

// // READ
// const fetchNodesFromDatabase = async () => {
// 	const { data: NodeTable, error } = await supabase
// 	  	.from('NodeTable')
// 	  	.select('*');
  
// 		if (error) {
// 	  		console.error("Error fetching nodes:", error);
// 	  		return [];
// 		}

// 		// sort this out 

// 		return NodeTable?.map((node: any) => ({
// 			id: node.id,
// 			position: { x: node.position_x, y: node.position_y },
// 			data: { label: node.title, data: { notes: node.notes } },
// 			type: node.type,
// 		}));
// 		// return nodes?.map((node: any) => ({
// 		// 	id: node.id,
// 		// 	position: { x: node.position_x, y: node.position_y },
// 		// 	data: { label: node.title, data: { notes: node.notes } },
// 		// 	type: node.type,
// 	  	// })
// };


// const saveCanvas = async () => {
//     //for (const node of nodes) {
//     // const { data, error } = await supabase
//     // 	.from('NodeTable')
//     // 	.upsert({
//     // 	  id: node.id,
//     // 	  title: node.data.label,
//     // 	  notes: node.data.data.notes,
//     // 	  type: node.type,
//     // 	  position_x: node.position.x,
//     // 	  position_y: node.position.y
//     // 	}, { onConflict: 'id' });
//     // 	.select()
  
//     // //   if (error) {
//     // // 	console.error("Error saving node:", error);
//     // //   }
//     console.log("All nodes saved successfully!")
// }
