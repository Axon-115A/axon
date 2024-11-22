export const defaultViewport = {
    "x": 0,
    "y": 0,
    "zoom": 1
}

/** 
* used in NodeList, RectNode, and CircleNode to adapt text color depending on background color.
* Calculates luminance of background color and returns 'white' or 'black'
*/
export function adaptTextColor(hex: string) {
	//remove # from hex string
	hex = hex.replace(/^#/, '');

	//convert to normal base 10 integer
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	//from https://en.wikipedia.org/w/index.php?title=Relative_luminance#Relative_luminance_and_%22gamma_encoded%22_colorspaces
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

	return luminance < 128 ? 'white' : 'black';
}