import { forwardRef,useImperativeHandle, useState, type Ref } from "react";
import { twMerge } from "tailwind-merge";
import type { CrosswordTileRef } from "../types/refs";
import type { CrosswordGridAction, CrosswordLetter, CrosswordTileState } from "../types/types";
import { DARK_HIGHLIGHT_TILE_COLOR, LARGE_TILE_SIZE, LIGHT_HIGHLIGHT_TILE_COLOR } from "../utils/crossword";

interface Props {
    data: CrosswordLetter;
    index: number;
    className?: string;
    handleAction: (call: CrosswordGridAction) => void;
}

/**
 * Individual Crossword Tile used with Crossword Grid to make a crossword puzzle
 */
const CrosswordTile = forwardRef(({
    data,
    index,
    className="",
    handleAction
}: Props,
    ref: Ref<CrosswordTileRef>
) => {
    const {
        type,
        cornerValue,
        character,
        across,
        down
    } = data;
    const [state, setState] = useState<CrosswordTileState>("idle");
    const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
    const [currChar, setCurrChar] = useState<string>("");
    /**
     * Handle highlighting / selecting tile + word
     */
    const onTileClick = () => {
        handleAction({ action: "highlight", parameter: index });
    }
    /**
     * Update tile state
     * @param newState new state of tile
     */
    const updateState = (newState: CrosswordTileState) => {
        setState(newState);
    }
    /**
     * Highlight the tile either darkly or lightly
     */
    const darkHighlight = () => {
        setBackgroundColor(DARK_HIGHLIGHT_TILE_COLOR);
    }
    const lightHighlight = () => {
        setBackgroundColor(LIGHT_HIGHLIGHT_TILE_COLOR);
    }
    /**
     * Remove the highlight from the tile
     */
    const removeHighlight = () =>{
        setBackgroundColor("#ffffff");
    }
    /**
     * Checks if the current character matches the character it's supposed to be
     */
    const checkTile = () => {
        return currChar === character;
    }
    /**
     * Getter Methods
     */
    const getAcrossWordIndex = () => { return across; }
    const getDownWordIndex = () => { return down; }
    const getState = () => { return state; }
    /**
     * CrosswordTileRef handler
     */
    useImperativeHandle(ref, () => ({
        darkHighlight: darkHighlight,
        lightHighlight: lightHighlight,
        removeHighlight: removeHighlight,
        getAcrossWordIndex: getAcrossWordIndex,
        getDownWordIndex: getDownWordIndex,
        updateState: updateState,
        getState: getState
    }));
    /* 
     * Render black tile if tile is not associated with a character / word.
     * NOTE: Uses inline-block align-bottom to ensure black tile aligns with other tiles
     */
    if (type === "background") {
        return (
            <div 
                className={twMerge(
                    "cursor-pointer aspect-square bg-black inline-block align-bottom",
                    className
                )}
                style={{
                    width: LARGE_TILE_SIZE,
                    height: LARGE_TILE_SIZE
                }}
            />
        );
    }
    /**
     * Else render inline-flex tile to ensure everything looks good
     */
    return (
        <button 
            className={twMerge(
                "cursor-pointer aspect-square inline-flex relative items-center justify-center",
                className
            )}
            style={{
                width: LARGE_TILE_SIZE,
                height: LARGE_TILE_SIZE,
                backgroundColor: backgroundColor
            }}
            type="button"
            onClick={onTileClick}
        >
            <div className="absolute text-lg top-0 left-1">
                {cornerValue < 0 ? "" : cornerValue}
            </div>
            <div className="text-4xl">
                {currChar}
            </div>
        </button>
    );
});

export default CrosswordTile;