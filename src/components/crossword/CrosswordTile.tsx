import { twMerge } from "tailwind-merge";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import {
	getTileCharColor,
	getTileHighlightColor,
	getTileSize,
	LARGE_TILE_SIZE,
} from "../../utils/crossword";
import type { TileState } from "../../utils/types";

interface Props {
	tile: TileState;
	className?: string;
	onClick: () => void;
}

/**
 * Individual Crossword Tile used with Crossword Grid to make a crossword puzzle
 */
const CrosswordTile = ({ tile, className = "", onClick }: Props) => {
	const { charHighlight, tileHighlight, character, cornerValue } = tile;
	const { width } = useWindowDimensions();
	const tileSize = getTileSize(width);
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
					className,
				)}
				style={{
					width: tileSize,
					height: tileSize,
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
				className,
			)}
			style={{
				width: tileSize,
				height: tileSize,
				backgroundColor: backgroundColor,
			}}
			type="button"
			onClick={onClick}
			role="menuitem"
			tabIndex={-1}
		>
			<div className="absolute text-sm md:text-lg top-0 left-1">
				{cornerValue < 0 ? "" : cornerValue}
			</div>
			<div className="text-xl md:text-4xl" style={{ color: textColor }}>
				{character}
			</div>
		</button>
	);
};

export default CrosswordTile;
