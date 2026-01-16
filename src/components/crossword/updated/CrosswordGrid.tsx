import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CrosswordData2, HintState, TileState, WordDirection, WordProgress } from "../../../types/types";
import { flipWordDirection, getTileClasses, highlightTile, LARGE_TILE_SIZE } from "../../../utils/crossword";
// // import CrosswordHint from "./CrosswordHint";
// import CrosswordMenu from "./CrosswordMenu";
// import CrosswordSettingsButton from "./CrosswordSettingsButton";
import CrosswordTile from "./CrosswordTile";
import CrosswordHint from "./CrosswordHint";

interface Props {
    data: CrosswordData2;
}

/**
 * Grid of crossword tiles to create a crossword puzzle
 */
const CrosswordGrid = ({
    data
}: Props
) => {
    /**
     * Parse Crossword Data
     */
    const {
        tiles,
        width,
        height,
        words
    } = data;
    const acrossWords = [...words.entries()]
        .filter(word => word[1].across !== null)
        .map(word => {
            return {
                index: word[0],
                data: word[1].across
            }
        });
    const downWords = [...words.entries()]
        .filter(word => word[1].down !== null)
        .map(word => {
            return {
                index: word[0],
                data: word[1].down
            }
        });
    /**
     * State / Ref Definition
     */
    const [currDirection, setCurrDirection] = useState<WordDirection>("across"); // Keeps track of whether to highlight across or down
    const [progress, setProgress] = useState<WordProgress[]>([]);
    const [tileStates, setTileStates] = useState<TileState[]>([]);
    const [acrossHintStates, setAcrossHintStates] = useState<HintState[]>([]);
    const [downHintStates, setDownHintStates] = useState<HintState[]>([]);
    /**
     * Methods / Hooks
     */
    /**
     * Highlight tile(s) and hint when interacted with
     */
    const onTileClick = (
        index: number
    ) => {
        const tiles = highlightTile(tileStates, currDirection, index);
        setTileStates(tiles[0]);
        setCurrDirection(tiles[1]);
    }
    const onHintClick = (
        direction: WordDirection,
        index: number
    ) => {
        
    }
    /**
     * Type character into tile and move the selection to a new tile that has no character in it.
     * preventDefault called to stop propagation of event to CrosswordTiles.
     * @param index tile index to change
     * @param char input character
     */
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const key = e.key;
        switch (key) {
            case " ":
                const tiles = flipWordDirection(tileStates, currDirection);
                setTileStates(tiles[0]);
                setCurrDirection(tiles[1]);
                break;
            default:
                break;
        }
        e.preventDefault();
    }
    /**
     * Init crossword progress and tile data.
     * Init starting word to highlight
     */
    useEffect(() => {
        const initAcrossHints: HintState[] = [];
        const initDownHints: HintState[] = [];
        const initTiles: TileState[] = [];
        const initProgress: WordProgress[] = [];
        let startWordIndex = -1;
        for (const word of words) {
            const wordIndex = word[0];
            const wordData = word[1];
            const { across, down } = wordData;
            if (across) {
                const tileIndices = tiles
                    .filter(tile => tile.across === wordIndex)
                    .map((_, index) => index);
                initProgress.push({
                    type: "across",
                    index: wordIndex,
                    answer: across.word,
                    tiles: tileIndices,
                    correct: false
                });
                initAcrossHints.push({
                    hint: across.hint,
                    index: wordIndex,
                    highlight: startWordIndex === -1,
                    textHighlight: "none"
                });
                if (startWordIndex <= -1) {
                    startWordIndex = across.startIndex;
                }
            }
            if (down) {
                const tileIndices = tiles
                    .filter(tile => tile.down === wordIndex)
                    .map((_, index) => index);
                initProgress.push({
                    type: "down",
                    index: wordIndex,
                    answer: down.word,
                    tiles: tileIndices,
                    correct: false
                });
                initDownHints.push({
                    hint: down.hint,
                    index: wordIndex,
                    highlight: false,
                    textHighlight: "none"
                });
            }
        }
        for (const tile of tiles) {
            const {
                across,
                down,
                cornerValue
            } = tile;
            initTiles.push({
                character: "",
                cornerValue: cornerValue,
                charHighlight: "none",
                tileHighlight: tile.type === "background" ? "background" : "none",
                acrossId: across,
                downId: down
            });
        }
        const initHighlightedTiles = highlightTile(initTiles, currDirection, startWordIndex);
        setTileStates(initHighlightedTiles[0]);
        setProgress(initProgress);
        setAcrossHintStates(initAcrossHints);
        setDownHintStates(initDownHints);
    }, []);
    return (
        <div 
            className="p-6 select-none border border-black relative focus:outline-0"
            role="application"
            tabIndex={0}
            onKeyDown={onKeyDown}
            // ref={gridRef}
        >
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-1 leading-0">
                    {/* TODO: Replace header w/ currently selected across or down word */}
                    {/* <h2 className="text-lg font-bold">{title}</h2> */}
                    <div
                        style={{
                            width: LARGE_TILE_SIZE * width,
                            height: LARGE_TILE_SIZE * height
                        }}
                    >
                        {tileStates.map((tile, index) => {
                            const row = Math.floor(index / width);
                            const column = index % width;
                            const className = getTileClasses(row, column, height);
                            const key = `tile-${index}`;
                            return (
                                <CrosswordTile 
                                    key={key} 
                                    tile={tile}
                                    className={className}
                                    onClick={() => {
                                        onTileClick(index);
                                    }}
                                />
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {acrossHintStates.length > 0 &&
                        <section className="flex flex-col">
                            <h2 className="text-lg font-bold">Across</h2>
                            {acrossHintStates.map((hint, index) => {
                                const key = `across-${index}`;
                                return (
                                    <CrosswordHint 
                                        key={key}    
                                        state={hint}
                                        onClick={() => {
                                            onHintClick("across", index);
                                        }}
                                    />
                                );
                            })}
                        </section>
                    }
                    {downHintStates.length > 0 &&
                        <section className="flex flex-col">
                            <h2 className="text-lg font-bold">Down</h2>
                            {downHintStates.map((hint, index) => {
                                const key = `down-${index}`;
                                return (
                                    <CrosswordHint 
                                        key={key}    
                                        state={hint}
                                        onClick={() => {
                                            onHintClick("down", index);
                                        }}
                                    />
                                );
                            })}
                        </section>
                    }
                </div>
            </div>
        </div>
    );
};

export default CrosswordGrid;