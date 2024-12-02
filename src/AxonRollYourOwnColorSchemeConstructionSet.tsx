
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

//"#1A5F61";  teal accent
//"#384764";  tertiary background
//"#1f1f1f";  vs code
//"#000C0F";  good background
//"#5b97a2";  default node
//"#08697D";  something

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





const idk = "#384764";
const CollectiveColorScheme = {
    background: "#090f10",
    minimap: idk,
    canvasControls: idk,
    nodeList: idk,
    defaultNodeColor: "#004f55",
    defaultEdgeColor: "#949494",
    signUpInButtons: idk,
}


const cookie = "#4A4643"
const Beige = {
    background: "#f5ebe0",
    minimap: "#edede9",
    canvasControls: cookie,
    nodeList: cookie,
    defaultNodeColor: "#d5bdaf",
    defaultEdgeColor: "#010204",
    signUpInButtons: cookie,
}


const ChosenColorScheme = Beige;
//           Change this  ^^^^^^^^^^^^^ to the name of your custom color scheme


// Remember to modify "--note-window-color" in NotesWindow.css to adjust the color of the NotesWindow
// (for some reason, react flow does not let you programatically change the color of the Panel component used by the NotesWindow, hence the manual css modification :P)

export default ChosenColorScheme;
