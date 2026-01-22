/**
 * Data to init crossword puzzle and words
 */
export interface CrosswordGridAction {
    action: CrosswordGridActions;
    parameter: any;
}
export type WordDirection = "across" | "down";
export type CrosswordGridActions = "revealLetter" | "revealWord" | "revealGrid" | "checkLetter" | "checkWord" | "checkGrid";
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
export interface CrosswordData {
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
    charHighlight: "none" | "wrong" | "correct";
    tileHighlight: "none" | "light" | "dark" | "background";
    acrossId: number;
    downId: number;
}
export interface HintState {
    direction: WordDirection;
    textHighlight: "none" | "complete" | "correct" | "wrong";
    highlight: boolean;
    hint: string;
    index: number;
}