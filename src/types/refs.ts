import type { CrosswordTileState } from "./types";
export type CrosswordTileRef = {
    darkHighlight: () => void; // Highlight darker when selected
    lightHighlight: () => void; // Highlight lighter when row or column is selected
    removeHighlight: () => void; // Remove highlighting when tile is no longer selected
    getAcrossWordIndex: () => number;
    getDownWordIndex: () => number;
    updateState: (newState: CrosswordTileState) => void;
    getState : () => CrosswordTileState;
}
