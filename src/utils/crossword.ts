import type { CrosswordData, HintState, TileState, WordDirection } from "../types/types";

/**
 * Config
 */
export const LARGE_TILE_SIZE = 80;
export const DARK_HIGHLIGHT_TILE_COLOR = "#9999FF";  // Color taken from https://www.boatloadpuzzles.com/playcrossword
export const LIGHT_HIGHLIGHT_TILE_COLOR = "#CCCCFF"; // Color taken from https://www.boatloadpuzzles.com/playcrossword
export const CORRECT_TEXT_COLOR = "#00d04b";
export const INCORRECT_TEXT_COLOR = "#ff0022";
export const GRAY_TEXT_COLOR = "#636167";
export const FIRST_COLUMN_TILE_CLASSES = "border-t border-x border-black";
export const FIRST_ROW_TILE_CLASSES = "border-t border-r border-black";
export const LAST_ROW_TILE_CLASSES = "border-b border-black";
export const MIDDLE_COLUMN_TILE_CLASSES = "border-t border-r border-black";

/**
 * Return appropriate Tailwind classes for crossword tile
 * @param column row index of tile
 * @param width length of crossword
 */
export const getTileClasses = (
    row: number,
    column: number,
    height: number
): string => {
    const classNames = [];
    if (row === 0) {
        classNames.push(FIRST_ROW_TILE_CLASSES);
    }
    if (column === 0) {
        classNames.push(FIRST_COLUMN_TILE_CLASSES);    
    }
    if (row !== 0 && column !== 0) {    
        classNames.push(MIDDLE_COLUMN_TILE_CLASSES);
    }
    if (row === height - 1) {
        classNames.push(LAST_ROW_TILE_CLASSES);
    }
    return classNames.join(" ");
}
/**
 * Get list of indices of target row
 * @param index index of tile
 * @param width length of crossword
 */
export const getRowIndices = (
    index: number,
    width: number
): number[] =>{
    const rowNumber = Math.floor(index / width);
    const startingRowIndex = rowNumber * width;
    const indices = [];
    for (let i = 0; i < width; i++) {
        indices.push(startingRowIndex + i);
    }
    return indices;
}
/**
 * Get list of indices of target column
 * @param index index of tile
 * @param width length of crossword
 * @param height height of crossword
 */
export const getColumnIndices = (
    index: number,
    width: number,
    height: number
): number[] => {
    const indices = [];
    const columnNumber = index % width;
    for (let i = 0; i < height; i++) {
        indices.push(columnNumber + i * width);
    }
    return indices;
}

/**
 * Get index in crossword (keyboard controls)
 */
export const getIndexAbove = (data: CrosswordData, index: number) => {
    const { width, height, tiles } = data;
    let startIndex = index - width < 0 ? (height - 1) * width : index - width;
    while (startIndex !== index) {
        if (tiles[startIndex].type === "word") {
            break;
        }
        startIndex = startIndex - width < 0 ? (height - 1) * width : startIndex - width;
    }
    return startIndex;
}
export const getIndexBelow = (data: CrosswordData, index: number) => {
    const { width, tiles } = data;
    let startIndex = (index + width) % tiles.length;
    while (startIndex !== index) {
        if (tiles[startIndex].type === "word") {
            break;
        }
        startIndex = (startIndex + width) % tiles.length;
    }
    return startIndex;
}
export const getIndexLeft = (data: CrosswordData, index: number) => {
    const { tiles } = data;
    let startIndex = index === 0 ? tiles.length - 1 : index - 1;
    while (startIndex !== index) {
        if (tiles[startIndex].type === "word") {
            break;
        }
        startIndex = startIndex === 0 ? tiles.length - 1 : startIndex - 1;
    }
    return startIndex;
}
export const getIndexRight = (data: CrosswordData, index: number) => {
    const { tiles } = data;
    let startIndex = (index + 1) % tiles.length; 
    while (startIndex !== index) {
        if (tiles[startIndex].type === "word") {
            break;
        }
        startIndex = (startIndex + 1) % tiles.length;
    }
    return startIndex;
}
/**
 * Get the next index to highlight after typing
 */
export const getIndexPostTyping = (
    data: CrosswordData, 
    direction: WordDirection,
    index: number
) => {
    const { tiles, across, down } = data;
    let outputIndex = direction === "across" ?
        getIndexRight(data, index) :
        getIndexBelow(data, index);
    if (direction === "across") {
        if (tiles[outputIndex].across === tiles[index].across) {
            return outputIndex;
        }
        let acrossIndex = tiles[index].across;
        for (const [key, value] of across) {
            if (key > acrossIndex) {
                return value.startIndex;
            }
        }
    } else {
        let downIndex = tiles[index].down;
        if (outputIndex > index && tiles[outputIndex].down === tiles[index].down) {
            return outputIndex;
        }
        for (const [key, value] of down) {
            if (key > downIndex) {
                return value.startIndex;
            }
        }
    }
    return index;
}
/**
 * If you hit Tab or Enter, get the next across word or down index.
 * Rotate back to the start of across if at the bottom or down.
 */
export const getNextWordIndex = (
    data: CrosswordData, 
    direction: WordDirection, 
    index: number
): { index: number, direction: WordDirection } => {
    const { across, down } = data;
    if (direction === "across") {
        for (const [key, value] of across) {
            if (key > index) {
                return {
                    index: value.startIndex,
                    direction: "across"
                };
            }    
        }
        
        const downEntries = [...down.entries()];
        if (downEntries.length > 0) {
            return {
                index: downEntries[0][1].startIndex,
                direction: "down"
            };
        }
    } else {
        for (const [key, value] of down) {
            if (key > index) {
                return {
                    index: value.startIndex,
                    direction: "down"
                };
            }    
        }
    }
    const acrossEntries = [...across.entries()];
    if (acrossEntries.length === 0) {
        return {
            index: 0,
            direction: "across"
        }
    }
    return {
        index: acrossEntries[0][1].startIndex,
        direction: "across"
    };
}

// New
/**
 * Given a tile's current state, output the appropriate background color it should be
 * @param state 
 * @returns hex color of new tile text
 */
export const getTileCharColor = (
    state: string
): string => {
    switch (state) {
        case "wrong":
            return INCORRECT_TEXT_COLOR;
        case "none":
        default:
            return "#ffffff";
    }
        
}
/**
 * Given a tile's current state, output the appropriate background color it should be
 * @param highlight tile highlight state
 * @returns hex color of new tile background
 */
export const getTileHighlightColor = (
    highlight: string
): string => {
    switch (highlight) {
        case "light":
            return LIGHT_HIGHLIGHT_TILE_COLOR;
        case "dark":
            return DARK_HIGHLIGHT_TILE_COLOR;
        case "background":
            return "#000000";
        case "none":
        default:
            return "#ffffff";
    }
}
/**
 * Given a hint's state, output the appropriate text color
 * @param state 
 * @returns hex color of new hint text
 */
export const getHintTextColor = (
    state: string
): string => {
    switch (state) {
        case "none":
            return "#000000";
        case "complete":
            return GRAY_TEXT_COLOR;
        case "correct":
            return CORRECT_TEXT_COLOR;
        default:
            return INCORRECT_TEXT_COLOR;
    }
}
/**
 * Given a hint's state, output the appropriate background color
 * @param state whether to highlight the hint or not
 * @returns hex color of new hint background
 */
export const getHintHighlightColor = (
    state: boolean
): string => {
    return state ? LIGHT_HIGHLIGHT_TILE_COLOR : "#ffffff";
}
/**
 * Flip crossword selection from across -> down and vice versa
 * @param tiles crossword tile data
 * @param direction whether to highlight across or down
 * @returns [new tile states, new direction to highlight] or unchanged if cannot flip
 */
export const flipWordDirection = (
    tiles: TileState[],
    direction: WordDirection
): [TileState[], WordDirection] => {
    const currSelectedTileIndex = tiles.findIndex(tile => tile.tileHighlight === "dark");
    if (currSelectedTileIndex !== undefined) {
        return highlightTile(tiles, direction, currSelectedTileIndex);
    }
    return [[...tiles], direction];
}
/**
 * Highlight tile in crossword grid and the rest belonging to the same word
 * @param tiles crossword tile data
 * @param direction whether to highlight across or down
 * @param index index of the selected tile
 * @returns [new tile states, new direction to highlight]
 */
export const highlightTile = (
    tiles: TileState[],
    direction: WordDirection,
    index: number,
): [TileState[], WordDirection] => {
    const newTiles = [...tiles];
    const selectedTile = newTiles[index];
    // Determine whether to flip the highlight (if possible)
    const shouldFlipDirection = selectedTile.tileHighlight === "dark";
    const isFlipPossible = direction === "across" ? selectedTile.downId > 0 : selectedTile.acrossId > 0;
    const targetDirection = shouldFlipDirection && isFlipPossible ?
        direction === "across" ? 
            "down" : 
            "across" :
        direction;     
    const currWordId = targetDirection === "across" ? selectedTile.acrossId : selectedTile.downId;
    // Remove highlighting from previous selection and highlight new selection
    const tilesToHighlight = targetDirection === "across" ? 
        newTiles.filter((tile, tileIndex) => index !== tileIndex && tile.acrossId === currWordId) :
        newTiles.filter((tile, tileIndex) => index !== tileIndex && tile.downId === currWordId);
    const previouslyHighlightedTiles = newTiles.filter(tile => tile.tileHighlight !== "none" && tile.tileHighlight !== "background");
    for (const tile of previouslyHighlightedTiles) {
        tile.tileHighlight = "none";
    }
    selectedTile.tileHighlight = "dark";
    for (const tile of tilesToHighlight) {
        tile.tileHighlight = "light";
    }
    return [newTiles, targetDirection];
}
/**
 * Highlight hint in crossword grid given its index and direction
 * @param hints crossword hint data
 * @param index index of the selected hint
 * @returns [new tile states, new direction to highlight]
 */
export const highlightHint = (
    hints: HintState[],
    index: number
) => {
    const newHints = [...hints];
    const prevHighlightedHints = newHints.filter(hint => hint.highlight);
    for (const hint of prevHighlightedHints) {
        hint.highlight = false;
    }
    newHints[index].highlight = true;
    return newHints;
}