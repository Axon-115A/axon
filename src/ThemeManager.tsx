export namespace ThemeManager {

	export function setCurrentTheme(theme: string) {
		if (theme != 'light' && theme != 'dark') throw new Error(`Invald theme "${theme}"`);

		document.documentElement.setAttribute('data-theme', theme);
	}

	export function getCurrentTheme() {
		return document.documentElement.getAttribute("data-theme");
	}

	//if your system theme is set to light, getComputedStyle will ALWAYS return light, even if the site theme is set to dark. other than that, there is no way to
	//read the individual light/dark mode color schemes (unless you straight up parse every css rule). hence, this somewhat convoluted method.
	//also, because of the light/dark mode css, the background of a node color by default will be the string literal "var(--default-node-color)" for some reason. this
	//screws over adaptTextColor (since again, that will always evaluate to the light mode color even if data-theme is dark). 
	const nodeLightTheme: string = "#d5bdaf";
	const edgeLightTheme: string = "#010204";

	const nodeDarkTheme: string = "#004f55";
	const edgeDarkTheme: string = "#949494";

	export const defaultNodeColor = {
		get value(): string {
			return getCurrentTheme() == 'light' ? nodeLightTheme : nodeDarkTheme;
		}
	};

	export const defaultEdgeColor = {
		get value(): string {
			return getCurrentTheme() == 'light' ? edgeLightTheme : edgeDarkTheme;
		}
	};



	/* 
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
}