export interface CrosswordGridAction {
    action: CrosswordGridActions;
    parameter: any;
}
export type CrosswordGridActions = "highlightAcross" | "highlightDown" | "highlight" | "type";
export type CrosswordTileState = 
    "idle" | 
    "selected-across" | 
    "selected-down" | 
    "adjacent-across" |
    "adjacent-down";
export interface CrosswordData {
    title: string; // Name of crossword puzzle / ID
    tiles: CrosswordLetter[]; // Tile Data
    width: number; // Crossword width (in tiles)
    height: number; // Crossword height (in tiles)
    across: Map<number, string>; // List of across words
    down: Map<number, string>; // List of down words
    acrossHints: Map<number, string>; // Hints for across words
    downHints: Map<number, string>; // Hints for down words
}
export interface CrosswordLetter {
    type: "word" | "background"; // Whether the tile is interactable or not part of the puzzle
    character: string; // The character it is associated with
    cornerValue: number; // Number to display in corner of tile (-1 if display nothing, else > 0 if it's the start of a word)
    across: number;
    down: number;
}
