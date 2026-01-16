import type { NumberMap } from "motion";

export interface CrosswordGridAction {
    action: CrosswordGridActions;
    parameter: any;
}
export interface TypeParameters {
    index: number;
    char: string;
}
export type WordDirection = "across" | "down";
export type CrosswordGridActions = "highlightAcross" | "highlightDown" | "highlight" | "type" | "revealLetter" | "revealWord" | "revealGrid" | "checkLetter" | "checkWord" | "checkGrid";
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

/**
 * Data to init crossword puzzle and words
 */
export interface CrosswordData2 {
    title: string;
    width: number;
    height: number;
    tiles: CrosswordLetter[];
    words: Map<number, WordsData>;
}
export interface WordsData {
    across: WordData | null;
    down: WordData | null;
}
export interface WordData {
    word: string;
    hint: string;
    startIndex: number;
}
/**
 * Progress made for the across and down words
 */
export interface WordProgress {
    type: WordDirection; // across or down word
    index: number;
    answer: string;
    tiles: number[];
    correct: boolean;
}
export interface TileState {
    character: string;
    cornerValue: number;
    charHighlight: "none" | "wrong";
    tileHighlight: "none" | "light" | "dark" | "background";
    acrossId: number;
    downId: number;
}
export interface HintState {
    textHighlight: "none" | "complete" | "correct" | "wrong";
    highlight: boolean;
    hint: string;
    index: number;
}