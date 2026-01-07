import type { CrosswordTileState } from "./types";
export type CrosswordTileRef = {
    darkHighlight: () => void; // Highlight darker when selected
    lightHighlight: () => void; // Highlight lighter when row or column is selected
    removeHighlight: () => void; // Remove highlighting when tile is no longer selected
    getAcrossWordIndex: () => number;
    getDownWordIndex: () => number;
    updateState: (newState: CrosswordTileState) => void;
    getState : () => CrosswordTileState;
    updateChar: (char: string) => void;
    getChar: () => string;
    checkTile: (char?: string) => void;
    removeTextColor: () => void;
}
export type CrosswordHintRef = {
    highlight: () => void; // Highlight hint
    unhighlight: () => void; // Unhighlights hint
    getIndex: () => number;
    onCorrect: () => void;
    onIncorrect: () => void;
    resetTextColor: () => void;
    fadeText: () => void;
    onErrorCheckMode: () => void;
}
export interface ModalRef {
	onShow: () => void;
	onHide: () => void;
}