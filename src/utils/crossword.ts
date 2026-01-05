// Cross Config
export const LARGE_TILE_SIZE = 80;
export const DARK_HIGHLIGHT_TILE_COLOR = "#9999FF";  // Color taken from https://www.boatloadpuzzles.com/playcrossword
export const LIGHT_HIGHLIGHT_TILE_COLOR = "#CCCCFF"; // Color taken from https://www.boatloadpuzzles.com/playcrossword
export const FIRST_COLUMN_TILE_CLASSES = "border-t border-x border-black";
export const FIRST_ROW_TILE_CLASSES = "border-t border-r border-black";
export const LAST_ROW_TILE_CLASSES = "border-b border-black";
export const MIDDLE_COLUMN_TILE_CLASSES = "border-t border-r border-black";

// Crossword Functions
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
