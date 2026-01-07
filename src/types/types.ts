export interface CrosswordGridAction {
    action: CrosswordGridActions;
    parameter: any;
}
export interface TypeParameters {
    index: number;
    char: string;
}
export type WordDirection = "across" | "down";
export type CrosswordGridActions = "highlightAcross" | "highlightDown" | "highlight" | "type";
export interface WordStatus {
    direction: WordDirection;
    id: number;
    correct: boolean;
}
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
    across: Map<number, WordData>; // List of across words
    down: Map<number, WordData>; // List of down words
}
export interface WordData {
    word: string;
    hint: string;
    startIndex: number;
}
export interface CrosswordLetter {
    type: "word" | "background"; // Whether the tile is interactable or not part of the puzzle
    character: string; // The character it is associated with
    cornerValue: number; // Number to display in corner of tile (-1 if display nothing, else > 0 if it's the start of a word)
    across: number;
    down: number;
}
export interface CrosswordSettings {
    errorCheckMode: boolean;
}