
//the default colors. Do not modify this!
const defaultColors = {
    background: "#141414",
    minimap: "#2c2c2c",
    canvasControls: "#2b2b2b",
    nodeList: "#000000",
    defaultNodeColor: "#6c5ce7",
    defaultEdgeColor: "#808080",
    signUpInButtons: "#1971c2",
}


//option D from Sakshi's Figma mockup
const FigmaOptionD = {
    background: "#182c3a",
    minimap: "#253855",
    canvasControls: "#253855",
    nodeList: "#6b4835",
    defaultNodeColor: "#567bb3",
    defaultEdgeColor: "#010204",
    signUpInButtons: "#772e25",
}


//Template for you to create your own color schemes. Copy and paste as desired
const ColorSchemeTemplate = {
    background: "",
    minimap: "",
    canvasControls: "",
    nodeList: "",
    defaultNodeColor: "",
    defaultEdgeColor: "",
    signUpInButtons: "",
}


const ChosenColorScheme = defaultColors;
//           Change this  ^^^^^^^^^^^^^ to the name of your custom color scheme


// Remember to modify "--note-window-color" in NotesWindow.css to adjust the color of the NotesWindow
// (for some reason, react flow does not let you programatically change the color of the Panel component used by the NotesWindow, hence the manual css modification :P)

export default ChosenColorScheme;
