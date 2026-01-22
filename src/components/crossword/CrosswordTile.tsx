import { twMerge } from "tailwind-merge";
import type { TileState } from "../../utils/types";
import { getTileCharColor, getTileHighlightColor, LARGE_TILE_SIZE } from "../../utils/crossword";

interface Props {
    tile: TileState;
    className?: string;    
    onClick: () => void;
}

/**
 * Individual Crossword Tile used with Crossword Grid to make a crossword puzzle
 */
const CrosswordTile = ({
    tile,
    className="",
    onClick
}: Props) => {
    const {
        charHighlight,
        tileHighlight,
        character,
        cornerValue
    } = tile;
    const backgroundColor = getTileHighlightColor(tileHighlight);
    const textColor = getTileCharColor(charHighlight);
    /* 
     * Render black tile if tile is not associated with a character / word.
     * NOTE: Uses inline-block align-bottom to ensure black tile and tiles with leters in them aligns with other tiles
     */
    if (tileHighlight === "background") {
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
                "cursor-pointer aspect-square inline-flex relative items-center justify-center align-bottom",
                className
            )}
            style={{
                width: LARGE_TILE_SIZE,
                height: LARGE_TILE_SIZE,
                backgroundColor: backgroundColor
            }}
            type="button"
            onClick={onClick}
        >
            <div className="absolute text-lg top-0 left-1">
                {cornerValue < 0 ? "" : cornerValue}
            </div>
            <div 
                className="text-4xl" 
                style={{ color: textColor }}
            >
                {character}
            </div>
        </button>
    );
};

export default CrosswordTile;