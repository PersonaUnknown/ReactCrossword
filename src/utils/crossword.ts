import type { CrosswordData, CrosswordData2, HintState, TileState, WordDirection, WordProgress } from "../types/types";

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
        case "correct":
            return CORRECT_TEXT_COLOR;
        case "none":
        default:
            return "#000000";
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
    const currSelectedTileIndex = getCurrTileIndex(tiles);
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
    if (selectedTile === undefined) {
        return [tiles, direction];
    }
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
    const previouslyHighlightedTiles = newTiles.filter(tile => 
        tile.tileHighlight !== "none" && 
        tile.tileHighlight !== "background"
    );
    for (const tile of previouslyHighlightedTiles) {
        if (tile.tileHighlight === "background") {
            continue;
        }
        tile.tileHighlight = "none";
    }
    selectedTile.tileHighlight = "dark";
    for (const tile of tilesToHighlight) {
        if (tile.tileHighlight === "background") {
            continue;
        }
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
    if (newHints[index] == undefined) {
       return newHints; 
    }
    const prevHighlightedHints = newHints.filter(hint => hint.highlight);
    for (const hint of prevHighlightedHints) {
        hint.highlight = false;
    }
    newHints[index].highlight = true;
    return newHints;
}

/**
 * Get index in crossword (keyboard controls)
 */
export const getIndexAbove2 = (data: CrosswordData2, index: number) => {
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
export const getIndexBelow2 = (data: CrosswordData2, index: number) => {
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
export const getIndexLeft2 = (data: CrosswordData2, index: number) => {
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
export const getIndexRight2 = (data: CrosswordData2, index: number) => {
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
 * Get the next tile index post typing
 * @param tiles crossword tile data
 * @param data used to get crossword dimensions to calculate horizontal and vertically adjacent tiles
 * @param direction whether to search horizontally or vertically
 * @returns the index of which tile to highlight after typing
 */
export const getNextTileIndex = (
    tiles: TileState[],
    data: CrosswordData2,
    direction: WordDirection
): number => {
    const currSelectedTileIndex = getCurrTileIndex(tiles);
    let outputIndex = direction === "across" ?
        getIndexRight2(data, currSelectedTileIndex) :
        getIndexBelow2(data, currSelectedTileIndex);
    if (direction === "across") {
        if (tiles[outputIndex].acrossId === tiles[currSelectedTileIndex].acrossId) {
            return outputIndex;
        }
        return tiles.findIndex(tile => tile.acrossId > tiles[currSelectedTileIndex].acrossId);
    } else {
        if (tiles[outputIndex].downId === tiles[currSelectedTileIndex].downId) {
            return outputIndex;
        }
        return tiles.findIndex(tile => tile.downId > tiles[currSelectedTileIndex].downId);
    }
}
/**
 * Type in character into target tile and set selected tile index to the next possible one in word
 * @param tiles crossword tile data
 * @param index index of the selected tile
 * @param char input character
 * @param moveCursor whether to update where cursor selection should be
 * @returns [new tile states, index of where the new cursor location]
 */
export const typeTile = (
    tiles: TileState[],
    data: CrosswordData2,
    direction: WordDirection,
    index: number,
    char: string,
): [TileState[], number] => {
    const newTiles = [...tiles];
    newTiles[index].character = char;
    const nextTileIndex = index === tiles.length - 1 ? index : getNextTileIndex(newTiles, data, direction);
    // Check if there is a valid across / down word available before final highlights
    let directionCheck = direction;
    if (direction === "across") {
        if (newTiles[index].acrossId === -1) {
            directionCheck = "down";
        }
    } else {
        if (newTiles[index].downId === -1) {
            directionCheck = "across";
        }
    } 
    const finalTileStates = highlightTile(newTiles, directionCheck, nextTileIndex)[0];
    return [finalTileStates, nextTileIndex];
}
/**
 * Get the index of the tile that should be highlighted after the user presses an ArrowKey
 * @param data crossword grid data
 * @param direction specific arrow key direction / direction to move tile highlight selection
 */
export const getArrowKeyIndex = (
    data: CrosswordData2, 
    tiles: TileState[],
    direction: "up" | "down" | "left" | "right"
): number => {
    const index = getCurrTileIndex(tiles);
    switch (direction) {
        case "up":
        default:
            return getIndexAbove2(data, index);
        case "down":
            return getIndexBelow2(data, index);
        case "left":
            return getIndexLeft2(data, index);
        case "right":
            return getIndexRight2(data, index);
    }
}
/**
 * Get the index of the currently selected tile
 * @param tiles crossword tile states
 */
export const getCurrTileIndex = (
    tiles: TileState[]
) => {
    return tiles.findIndex(tile => tile.tileHighlight === "dark");
}
/**
 * Get the current input for target word
 */
const getCurrWordInput = (
    progress: WordProgress,
    tiles: TileState[]
): string => {
    const current = progress.tiles.map(tile => {
        const char = tiles[tile].character;
        return char === "" ? "_" : char;
    }).join("");
    return current;
}
/**
 * On typing into a tile, update the current word progress
 * @param progress word progress of current crossword
 * @param tiles tile states of crossword puzzle
 * @param across across word number to check
 * @param down down word number to check
 */
export const updateWordProgress = (
    progress: WordProgress[],
    tiles: TileState[],
    across: number | null,
    down: number | null
): WordProgress[] => {
    const newProgress = [...progress];
    if (across) {
        const acrossProgress = newProgress.find(
            progress => progress.type === "across" && 
            progress.index === across
        );
        if (acrossProgress) {
            acrossProgress.correct = getCurrWordInput(acrossProgress, tiles) === acrossProgress.answer;
        }
    }
    if (down) {
        const downProgress = newProgress.find(
            progress => progress.type === "down" && 
            progress.index === down
        );
        if (downProgress) {
            downProgress.correct = getCurrWordInput(downProgress, tiles) === downProgress.answer;
        }
    }
    return newProgress;
}
/**
 * Check if a crossword puzzle is complete based on your word progress
 * @param progress current progress completing each word
 */
export const checkWordProgress = (
    progress: WordProgress[]
): boolean => {
    if (progress.length === 0) {
        return false;
    }
    for (const word of progress) {
        if (!word.correct) {
            return false;
        }
    }
    return true;
}
/**
 * Update hint text color based on word completion
 * @param progress current progress completing each word
 * @param tiles current state of crossword tiles
 * @param hints current state of hints to change text highlighting
 * @param errorCheckMode whether to highlight text differently on incorrect answers
 */
export const updateHintText = (
    progress: WordProgress[],
    tiles: TileState[],
    hints: HintState[],
    errorCheckMode: boolean
): HintState[] => {
    const newHints = [...hints];
    for (const hint of newHints) {
        const progressData = progress.find(word => word.type === hint.direction && word.index === hint.index);
        if (!progressData) {
            continue;
        }
        if (progressData.correct && errorCheckMode) {
            hint.textHighlight = "correct";
        }
        const currWord = getCurrWordInput(progressData, tiles);
        hint.textHighlight = currWord.includes("_") ? 
            "none" : 
            errorCheckMode && !progressData.correct ?
                "wrong" : 
                "complete";

    }
    return newHints;
}
/**
 * Re-color crossword tiles based on if the character input is correct or not
 * @param data crossword data
 * @param tiles crossword tile data
 * @param errorCheckMode whether to highlight text differently on incorrect answers
 */
export const recolorTiles = (
    data: CrosswordData2,
    tiles: TileState[],
    errorCheckMode: boolean
): TileState[] => {
    const newTiles = [...tiles];
    for (let i = 0; i < newTiles.length; i++) {
        const tile = newTiles[i];
        const answer = data.tiles[i].character;
        if (errorCheckMode) {
            tile.charHighlight = tile.character === answer ? "correct" : "wrong"; 
        } else {
            tile.charHighlight = "none";
        }
    }
    return newTiles;
}
/**
 * Replace the character in the current tile to the correct answer
 * @param data crossword data
 * @param tiles crossword tile data
 * @param progress current word progress
 */
export const revealLetter = (
    data: CrosswordData2,
    tiles: TileState[],
    progress: WordProgress[],
): [TileState[], WordProgress[]] => {
    const index = getCurrTileIndex(tiles);
    const newTiles = [...tiles];
    const tile = newTiles[index];
    const answer = data.tiles[index].character;
    tile.character = answer;
    const newProgress = updateWordProgress(progress, tiles, tile.acrossId, tile.downId);
    return [newTiles, newProgress];
}
/**
 * Replace all the tiles in the same direction and word of the current tile to the correct answer
 * @param tiles crossword tile data
 * @param progress current word progress
 * @param direction whether to reveal an across or down word
 */
export const revealWord = (
    tiles: TileState[],
    progress: WordProgress[],
    direction: WordDirection
): [TileState[], WordProgress[]] => {
    const index = getCurrTileIndex(tiles);
    const newTiles = [...tiles];
    const selectedTile = newTiles[index];
    const acrossIndex = selectedTile.acrossId;
    const downIndex = selectedTile.downId;
    if (direction === "across") {
        if (acrossIndex !== -1) {
            const acrossTiles = newTiles.filter(tile => tile.acrossId === acrossIndex)
            for (let i = 0; i < acrossTiles.length; i++) {
                const tile = acrossTiles[i];
                const acrossAnswer = progress.find(word => word.index === acrossIndex);
                if (acrossAnswer) {
                    tile.character = acrossAnswer.answer[i];
                } 
            }
        }
    } else {
        if (downIndex !== -1) {
            const downTiles = newTiles.filter(tile => tile.downId === downIndex)
            for (let i = 0; i < downTiles.length; i++) {
                const tile = downTiles[i];
                const downAnswer = progress.find(word => word.index === downIndex);
                if (downAnswer) {
                    tile.character = downAnswer.answer[i];
                } 
            }
        }
    }
    const newProgress = updateWordProgress(progress, newTiles, acrossIndex, downIndex);
    return [newTiles, newProgress];
}
/**
 * Auto-solve the puzzle
 * @param data crossword data
 * @param tiles crossword tile data
 * @param progress current word progress
 */
export const revealGrid = (
    data: CrosswordData2,
    tiles: TileState[],
    progress: WordProgress[]
): [TileState[], WordProgress[]] => {
    const newTiles = [...tiles];
    for (let i = 0; i < newTiles.length; i++) {
        const tile = newTiles[i];
        const answer = data.tiles[i].character;
        tile.character = answer;
    }
    const newProgress = [...progress];
    for (const word of progress) {
        word.correct = true;
    }
    return [newTiles, newProgress];
}
/**
 * Check if the currently selected tile is correct
 * @param data crossword data
 * @param tiles crossword tile data
 */
export const checkLetter = (
    data: CrosswordData2,
    tiles: TileState[]
): TileState[] => {
    const index = getCurrTileIndex(tiles);
    const newTiles = [...tiles];
    const tile = newTiles[index];
    const answer = data.tiles[index].character;
    if (tile.character !== "") {
        tile.charHighlight = tile.character === answer ? "correct" : "wrong";
    }
    return newTiles;
}
/**
 * Check if the currently selected tile's word is correct
 * @param data crossword data
 * @param tiles crossword tile data
 * @param direction whether to check across or down
 */
export const checkWord = (
    data: CrosswordData2,
    tiles: TileState[],
    direction: WordDirection
) => {
    const index = getCurrTileIndex(tiles);
    const newTiles = [...tiles];
    const currTile = newTiles[index];
    const selectedTiles = direction === "across" ?
        newTiles.map((tileData, index) => ({ tileData, index })).filter(tile => tile.tileData.acrossId === currTile.acrossId) :
        newTiles.map((tileData, index) => ({ tileData, index })).filter(tile => tile.tileData.downId === currTile.downId);
    console.log(selectedTiles);
    for (const tile of selectedTiles) {
        const { index } = tile;
        const { character } = tile.tileData;
        const answer = data.tiles[index].character;
        if (character !== "") {
            newTiles[index].charHighlight = character === answer ? "correct" : "wrong";
        }
    }
    return newTiles;
}