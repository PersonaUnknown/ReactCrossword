import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CrosswordData2, CrosswordSettings, HintState, TileState, WordDirection, WordProgress } from "../../../types/types";
import { checkWordProgress, flipWordDirection, getArrowKeyIndex, getTileClasses, highlightHint, highlightTile, LARGE_TILE_SIZE, recolorTiles, typeTile, updateHintText, updateWordProgress } from "../../../utils/crossword";
// // import CrosswordHint from "./CrosswordHint";
// import CrosswordMenu from "./CrosswordMenu";
import CrosswordSettingsButton from "./CrosswordSettingsButton";
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
    /**
     * State / Ref Definition
     */
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [currDirection, setCurrDirection] = useState<WordDirection>("across"); // Keeps track of whether to highlight across or down
    const [progress, setProgress] = useState<WordProgress[]>([]);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [settings, setSettings] = useState<CrosswordSettings>({ 
        errorCheckMode: false
    });
    const [tileStates, setTileStates] = useState<TileState[]>([]);
    const [hintStates, setHintStates] = useState<HintState[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);
    const acrossHints = hintStates.filter(hint => hint.direction === "across");
    const downHints = hintStates.filter(hint => hint.direction === "down");
    /**
     * Methods / Hooks
     */
    /**
     * Highlight tile(s) and hint when interacted with
     */
    const highlightHintHelper = (
        direction: WordDirection,
        index: number
    ) => {
        const hintId = direction === "across" ? tiles[index].across : tiles[index].down;
        const hintIndex = hintStates.findIndex(hint => hint.index === hintId);
        const newHintStates = highlightHint(hintStates, hintIndex);
        setHintStates(newHintStates);
    }
    const onTileClick = (
        index: number
    ) => {
        // Check if there is a valid across / down word available
        let directionCheck = currDirection;
        if (currDirection === "across") {
            if (tileStates[index].acrossId === -1) {
                directionCheck = "down";
            }
        } else {
            if (tileStates[index].downId === -1) {
                directionCheck = "across";
            }
        } 
        // Highlight tile and hint
        const newTileStates = highlightTile(tileStates, directionCheck, index);
        const newDirection = newTileStates[1];
        setTileStates(newTileStates[0]);
        setCurrDirection(newDirection);
        highlightHintHelper(newDirection, index);
    }
    const onHintClick = (
        direction: WordDirection,
        index: number
    ) => { 
        if (hintStates[index].highlight) {
            return;
        }
        const wordId = hintStates[index].index;
        const startIndex = direction === "across" ?
            words.get(wordId)?.across?.startIndex :
            words.get(wordId)?.down?.startIndex;
        if (startIndex !== undefined) {
            let newTiles = highlightTile(tileStates, currDirection, startIndex);
            if (direction !== currDirection) {
                newTiles = flipWordDirection(newTiles[0], currDirection);
            }
            setTileStates(newTiles[0]);
            setCurrDirection(newTiles[1]);
        }
        const newHintStates = highlightHint(hintStates, index);
        setHintStates(newHintStates);
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
            case "Tab":
            case "Enter":
                // TODO: Highlight next word
                break;
            case "ArrowUp":
                // TODO: Move up
                onTileClick(getArrowKeyIndex(data, tileStates, "up"));
                break;
            case "ArrowDown":
                // TODO: Move down
                onTileClick(getArrowKeyIndex(data, tileStates, "down"));
                break;
            case "ArrowLeft":
                // TODO: Move left
                onTileClick(getArrowKeyIndex(data, tileStates, "left"));
                break;
            case "ArrowRight":
                // TODO: Move right
                onTileClick(getArrowKeyIndex(data, tileStates, "right"));
                break;
            case "Backspace":
                // TODO: Delete and move backwards
                break;
            case "Delete":
                // TODO: Clear and don't move selection
                break;
            case " ":
                // Flip word direction
                const flippedTileStates = flipWordDirection(tileStates, currDirection);
                setTileStates(flippedTileStates[0]);
                setCurrDirection(flippedTileStates[1]);
                const currSelectedTileIndex = flippedTileStates[0].findIndex(tile => tile.tileHighlight === "dark");
                highlightHintHelper(flippedTileStates[1], currSelectedTileIndex);
                break;
            default:
                // Type in character
                const parsedChar = key.toUpperCase();
                if (!canEdit || parsedChar.length !== 1 || !/[a-zA-Z]/.test(parsedChar)) {
                    console.log(canEdit);
                    return;
                }
                const typeTargetIndex = tileStates.findIndex(tile => tile.tileHighlight === "dark");
                const newTileStates = typeTile(
                    tileStates, 
                    data,
                    currDirection,
                    typeTargetIndex, 
                    parsedChar,
                );
                const currTile = newTileStates[0][typeTargetIndex];
                const updatedWordProgress = updateWordProgress(progress, newTileStates[0], currTile.acrossId, currTile.downId);
                setProgress(updatedWordProgress);
                setTileStates(recolorTiles(data, newTileStates[0], settings.errorCheckMode));
                highlightHintHelper(currDirection, newTileStates[1]);
                break;
        }
        e.preventDefault();
    }
    /**
     * Init crossword progress and tile data.
     * Init starting word to highlight
     */
    useEffect(() => {
        const initHints: HintState[] = [];
        const initTiles: TileState[] = [];
        const initProgress: WordProgress[] = [];
        let startWordIndex = -1;
        for (const word of words) {
            const wordIndex = word[0];
            const wordData = word[1];
            const { across, down } = wordData;
            if (across) {
                const tileIndices = tiles
                    .map((data, index) => ({ data, index }))
                    .filter(tile => tile.data.across === wordIndex)
                    .map(tile => tile.index);
                initProgress.push({
                    type: "across",
                    index: wordIndex,
                    answer: across.word,
                    tiles: tileIndices,
                    correct: false
                });
                initHints.push({
                    direction: "across",
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
                    .map((data, index) => ({ data, index }))
                    .filter(tile => tile.data.down === wordIndex)
                    .map(tile => tile.index);
                initProgress.push({
                    type: "down",
                    index: wordIndex,
                    answer: down.word,
                    tiles: tileIndices,
                    correct: false
                });
                initHints.push({
                    direction: "down",
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
        setHintStates(initHints);
    }, []);
    /**
     * Check if game is complete on word progress change
     */
    useEffect(() => {
        // Check required because progress needs to be initialized first
        if (canEdit && progress.length > 0) {
            const hasWon = checkWordProgress(progress);
            if (hasWon) {
                setCanEdit(false);
                // TODO: Add you won message
            }
        }
    }, [progress]);
    /**
     * Re-focus crossword on start + exiting settings menu
     */
    useEffect(() => {
        if (canEdit) {
            gridRef?.current?.focus();
        }
    }, [canEdit]);
    /**
     * Whenever the settings are changed, re-apply stylings to tiles and hints 
     */
    useEffect(() => {
        // Check required because states need to be initialized first
        if (hintStates.length > 0) {
            const newHintStates = updateHintText(progress, tileStates, hintStates, settings.errorCheckMode);
            setHintStates(newHintStates);
        }
        if (tileStates.length > 0) {
            const newTileStates = recolorTiles(data, tileStates, settings.errorCheckMode);
            setTileStates(newTileStates);
        }
    }, [progress, settings]);
    return (
        <div 
            className="p-6 select-none border border-black relative focus:outline-0"
            role="application"
            tabIndex={0}
            onKeyDown={onKeyDown}
            ref={gridRef}
        >
            <AnimatePresence>
                {!hasWon && !canEdit && (
                    <>
                        <motion.button 
                            className="absolute inset-0 bg-[#00000080] z-10" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            type="button"
                            onClick={() => { setCanEdit(true); }}
                        />
                    </> 
                )}
            </AnimatePresence>
            <div className="flex flex-row gap-1 justify-end">
                {/* <CrosswordMenu 
                    hasWon={hasWon}
                    canEdit={canEdit}
                    setCanEdit={setCanEdit}
                    handleAction={handleAction}
                /> */}
                <CrosswordSettingsButton
                    hasWon={hasWon} 
                    settings={settings}
                    setSettings={setSettings}
                    canEdit={canEdit}
                    setCanEdit={setCanEdit}
                />
            </div>
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
                    {acrossHints.length > 0 &&
                        <section className="flex flex-col">
                            <h2 className="text-lg font-bold">Across</h2>
                            {acrossHints.map((hint, index) => {
                                const key = `across-${index}`;
                                const hintIndex = hintStates.findIndex(state => state === hint);
                                return (
                                    <CrosswordHint 
                                        key={key}    
                                        state={hint}
                                        onClick={() => {
                                            onHintClick("across", hintIndex);
                                        }}
                                    />
                                );
                            })}
                        </section>
                    }
                    {downHints.length > 0 &&
                        <section className="flex flex-col">
                            <h2 className="text-lg font-bold">Down</h2>
                            {downHints.map((hint, index) => {
                                const key = `down-${index}`;
                                const hintIndex = hintStates.findIndex(state => state === hint);
                                return (
                                    <CrosswordHint 
                                        key={key}    
                                        state={hint}
                                        onClick={() => {
                                            onHintClick("down", hintIndex);
                                        }}
                                    />
                                );
                            })}
                        </section>
                    }
                </div>
            </div>
            {progress.map((word, index) => {
                const key = `progress-${index}`;
                const current = word.tiles.map(tile => {
                    const char = tileStates[tile].character;
                    return char === "" ? "_" : char;
                });
                const isCorrect = word.correct ? "Correct" : "Wrong";
                return (
                    <div key={key}>
                        {word.index} Current: {current} Answer: {word.answer} State: {isCorrect}
                    </div>
                )
            })}
        </div>
    );
};

export default CrosswordGrid;