import { useCallback, useEffect, useRef, useState } from "react";
import type { CrosswordHintRef, CrosswordTileRef } from "../types/refs";
import type { CrosswordData, CrosswordGridAction, WordDirection, WordStatus } from "../types/types";
import { getColumnIndices, getIndexAbove, getIndexBelow, getIndexLeft, getIndexPostTyping, getIndexRight, getNextWordIndex, getRowIndices, getTileClasses, LARGE_TILE_SIZE } from "../utils/crossword";
import CrosswordHint from "./CrosswordHint";
import CrosswordTile from "./CrosswordTile";

interface Props {
    data: CrosswordData;
}

/**
 * Grid of crossword tiles to create a crossword puzzle
 */
const CrosswordGrid = ({
    data
}: Props
) => {
    const {
        title,
        tiles,
        width,
        height,
        across,
        down,
    } = data;
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
    const [direction, setDirection] = useState<WordDirection>("across"); // Whether to highlight across or down when clicking on a selected tile
    const acrossHintRefs = useRef<CrosswordHintRef[]>([]); // Refs to crossword hints
    const downHintRefs = useRef<CrosswordHintRef[]>([]); // Refs to crossword hints
    const tileRefs = useRef<CrosswordTileRef[]>([]); // Refs to crossword tiles
    const highlightedTileIndices = useRef<number[]>([]); // Refs of what tiles are highlighted to make it easier to remove the highlighting
    const lastHighlightedHint = useRef<{ direction: WordDirection, index: number }>(null);
    const statusesRef = useRef<WordStatus[]>([]);
    /**
     * Highlight across or down tiles
     */
    const highlight = (index: number, targetDirection: WordDirection | null = null) => {
        const selectedTileState = tileRefs.current[index].getState();
        const acrossIndex = tileRefs.current[index].getAcrossWordIndex();
        const downIndex = tileRefs.current[index].getDownWordIndex();
        switch (selectedTileState) {
            case "idle":
                if (targetDirection === "across") {
                    if (across.has(acrossIndex)) {
                        highlightAcross(index);
                    } else {
                        highlightDown(index);
                    }
                    return;
                } else if (targetDirection === "down") {
                    if (down.has(downIndex)) {
                        highlightDown(index);
                    } else {
                        highlightAcross(index);
                    }
                    return;
                }
                if (direction === "across") {
                    if (across.has(acrossIndex)) {
                        highlightAcross(index);
                    } else {
                        highlightDown(index);
                    }
                } else if (direction === "down") {
                    if (down.has(downIndex)) {
                        highlightDown(index);
                    } else {
                        highlightAcross(index);
                    }
                }
                break;
            case "adjacent-across":
                highlightAcross(index);
                break;
            case "adjacent-down":
                highlightDown(index);
                break;
            case "selected-across":
                if (!down.has(downIndex)) {
                    return;
                }
                highlightDown(index);
                break;
            case "selected-down":
                if (!across.has(acrossIndex)) {
                    return;
                }
                highlightAcross(index);
                break;
        }
    }
    /**
     * Highlight all tiles that belong to the word across.
     * If no word exists, do nothing.
     */
    const highlightAcross = (index: number) => {
        const acrossIndex = tileRefs.current[index].getAcrossWordIndex();
        // Remove previous highlights
        for (const idx of highlightedTileIndices.current) {
            tileRefs.current[idx].removeHighlight();
            tileRefs.current[idx].updateState("idle");
        }
        // Highlight new across word
        const indices = getRowIndices(index, width);
        for (const idx of indices) {
            if (tileRefs.current[idx].getAcrossWordIndex() !== acrossIndex) {
                continue;
            }
            if (idx === index) {
                tileRefs.current[index].darkHighlight();    
                tileRefs.current[index].updateState("selected-across");    
            } else {
                tileRefs.current[idx].lightHighlight();
                tileRefs.current[idx].updateState("adjacent-across");
            }
        }
        highlightedTileIndices.current = [...indices];
        setDirection("across");
        highlightHint("across", acrossIndex);
    }
    /**
     * Highlight all tiles that belong to the word down
     * If no word exists, do nothing.
     */
    const highlightDown = (index: number) => {
        const downIndex = tileRefs.current[index].getDownWordIndex();
        // Remove previous highlights
        for (const idx of highlightedTileIndices.current) {
            tileRefs.current[idx].removeHighlight();
            tileRefs.current[idx].updateState("idle");
        }
        // Highlight new across word
        const indices = getColumnIndices(index, width, height);
        for (const idx of indices) {
            if (tileRefs.current[idx].getDownWordIndex() !== downIndex) {
                continue;
            }
            if (idx === index) {
                tileRefs.current[index].darkHighlight();    
                tileRefs.current[index].updateState("selected-down");    
            } else {
                tileRefs.current[idx].lightHighlight();
                tileRefs.current[idx].updateState("adjacent-down");
            }
        }
        highlightedTileIndices.current = [...indices];
        setDirection("down");
        highlightHint("down", downIndex);
    }
    /**
     * Highlights the specific crossword hint
     * @param direction whether to highlight an across or down word hint
     * @param id number associated with word
     */
    const highlightHint = (direction: WordDirection, id: number) => {
        const refs = direction === "across" ? acrossHintRefs.current : downHintRefs.current;
        if (lastHighlightedHint.current) {
            const { direction, index } = lastHighlightedHint.current;
            if (direction === "across") {
                acrossHintRefs?.current[index]?.unhighlight();
            } else if (direction === "down") {
                downHintRefs?.current[index]?.unhighlight();
            }
            lastHighlightedHint.current = null;
        }
        let hintIndex = 0;
        for (const hint of refs) {
            const index = hint.getIndex();
            if (index === id) {
                hint.highlight();
                break;
            }
            hintIndex++;
        }
        lastHighlightedHint.current = {
            direction: direction,
            index: hintIndex
        }
    }
    /**
     * Type character into tile and move the selection to a new tile that has no character in it.
     * preventDefault called to stop propagation of event to CrosswordTiles.
     * @param index tile index to change
     * @param char input character
     */
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const key = e.key;
        const currSelectedTileIndex = getCurrentSelectedTileIndex();
        switch (key) {
            case "Tab":
            case "Enter":
                const index = direction === "across" ? 
                    tileRefs.current[currSelectedTileIndex].getAcrossWordIndex() :
                    tileRefs.current[currSelectedTileIndex].getDownWordIndex();
                const nextWordIndexData = getNextWordIndex(data, direction, index);
                highlight(nextWordIndexData.index, nextWordIndexData.direction);
                break;
            case "ArrowUp":
                highlight(getIndexAbove(data, currSelectedTileIndex));
                break;
            case "ArrowDown":
                highlight(getIndexBelow(data, currSelectedTileIndex));
                break;
            case "ArrowLeft":
                highlight(getIndexLeft(data, currSelectedTileIndex));
                break;
            case "ArrowRight":
                highlight(getIndexRight(data, currSelectedTileIndex));
                break;
            case "Backspace":
                if (tileRefs.current[currSelectedTileIndex].getChar() === "") {
                    highlight(getIndexLeft(data, currSelectedTileIndex));
                } else {
                    type("");
                }
                break;
            case "Delete":
                type("");
                break;
            case " ":
                if (currSelectedTileIndex === undefined) {
                    return;
                }
                highlight(currSelectedTileIndex);
                break;
            default:
                if (!canEdit) {
                    return;
                }
                if (key.length === 1 && /[a-zA-Z]/.test(key)) {
                    type(key);
                }
                break;
        }
        e.preventDefault();
    }
    const type = (char: string) => {
        // 1. Type in the current
        const parsedChar = char.toUpperCase();
        const currSelectedTileIndex = getCurrentSelectedTileIndex();
        if (currSelectedTileIndex < 0 && currSelectedTileIndex >= tileRefs.current.length) {
            return;
        } 
        tileRefs.current[currSelectedTileIndex].updateChar(parsedChar);
        // 2. Check if the word is fully typed out and is correct
        tileRefs.current[currSelectedTileIndex].checkTile(char);
        const acrossIndex = tileRefs.current[currSelectedTileIndex].getAcrossWordIndex();
        const downIndex = tileRefs.current[currSelectedTileIndex].getDownWordIndex();
        const newWordStatuses = [...statusesRef.current];
        if (acrossIndex !== -1) {
            let currAcrossWordTyped = "";
            const acrossTiles = tileRefs.current.filter(tile => tile.getAcrossWordIndex() === acrossIndex);
            for (const tile of acrossTiles) {
                if (tileRefs.current[currSelectedTileIndex] === tile) {
                    // Because useState is not updated at this point for current tile
                    currAcrossWordTyped += parsedChar;
                } else {
                    currAcrossWordTyped += tile.getChar() === "" ? "_" : tile.getChar();
                }
            }
            const acrossWordData = across.get(acrossIndex);
            const acrossRef = acrossHintRefs.current.find(ref => ref.getIndex() === acrossIndex);
            const statusIndex = newWordStatuses.findIndex(status => status.direction === "across" && status.id === acrossIndex);
            if (acrossWordData) {
                if (currAcrossWordTyped === acrossWordData.word) {
                    acrossRef?.onCorrect();
                    newWordStatuses[statusIndex].correct = true;
                } else if (!currAcrossWordTyped.includes("_") && currAcrossWordTyped !== acrossWordData.word) {
                    acrossRef?.onIncorrect();
                    newWordStatuses[statusIndex].correct = false;
                }
            }
        }
        if (downIndex !== -1) {
            let currDownWordTyped = "";
            const downTiles = tileRefs.current.filter(tile => tile.getDownWordIndex() === downIndex);
            for (const tile of downTiles) {
                if (tileRefs.current[currSelectedTileIndex] === tile) {
                    // Because useState is not updated at this point for current tile
                    currDownWordTyped += parsedChar;
                } else {
                    currDownWordTyped += tile.getChar() === "" ? "_" : tile.getChar();
                }
            }
            const downWordData = down.get(downIndex);
            const downRef = downHintRefs.current.find(ref => ref.getIndex() === downIndex);
            const statusIndex = newWordStatuses.findIndex(status => status.direction === "down" && status.id === downIndex);
            if (downWordData) {
                if (currDownWordTyped === downWordData.word) {
                    downRef?.onCorrect();
                    newWordStatuses[statusIndex].correct = true;
                } else if (!currDownWordTyped.includes("_") && currDownWordTyped !== downWordData.word) {
                    downRef?.onIncorrect();
                    newWordStatuses[statusIndex].correct = false;
                }
            }
        }
        setWordStatuses(newWordStatuses);
        statusesRef.current = newWordStatuses;
        // 3. Move the selection to a new 
        if (char === "") {
            return;
        }
        highlight(getIndexPostTyping(data, direction, getCurrentSelectedTileIndex()));
    }   
    /**
     * Get index of current tile selected (-1 if cannot be found)
     */
    const getCurrentSelectedTileIndex = (): number => {
        const currSelectedTileIndex = highlightedTileIndices.current.find(index => {
            const state = tileRefs.current[index].getState();
            return state === "selected-across" || state === "selected-down";
        });
        if (currSelectedTileIndex === undefined) {
            return -1;
        }
        return currSelectedTileIndex;
    }
    /**
     * Function handler for 
     * @param call the action you want to call and any parameters needed to call it
     */
    const handleAction = (call: CrosswordGridAction) => {
        const { action, parameter } = call;
        switch (action) {
            case "highlightAcross":
                highlightAcross(parameter);
                break;
            case "highlightDown":
                highlightDown(parameter);
                break;
            case "highlight":
                highlight(parameter);
                break;
            default:
                break;
        }
    }
    /**
     * Init crossword to highlight first possible across word
     * Init status of all words in crossword to determine win condition
     */
    useEffect(() => {
        const highlightFirstAcross = () => {
            for (let i = 0; i < tiles.length; i++) {
                const across = tiles[i].across;
                if (across > 0) {
                    highlightAcross(i);
                    break;
                }
            }
            highlightHint("across", 1);
            const statuses: WordStatus[] = [];
            for (const [key, _] of across) {
                statuses.push({
                    direction: "across",
                    id: key,
                    correct: false
                });
            }   
            for (const [key, _] of down) {
                statuses.push({
                    direction: "down",
                    id: key,
                    correct: false
                });
            }
            setWordStatuses(statuses);
            statusesRef.current = statuses;
        };
        highlightFirstAcross();
    }, []);
    /**
     * Check for win condition every time the word statuses changes.
     * useState to trigger useEffect but useRef to get accurate value when checking
     */
    const checkForWin = useCallback((): boolean => {
        if (statusesRef.current.length === 0) {
            return false;
        }
        for (const status of statusesRef.current) {
            if (!status.correct) {
                return false;
            }
        }
        return true;
    }, []);
    useEffect(() => {
        if (!canEdit) {
            return;
        }
        if (checkForWin()) {
            alert("You Won!");
            setCanEdit(false);
        }
    }, [wordStatuses, canEdit, checkForWin]);
    return (
        <div 
            className="p-6 select-none border border-black"
            role="application"
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-1 leading-0">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <div
                        style={{
                            width: LARGE_TILE_SIZE * width,
                            height: LARGE_TILE_SIZE * height
                        }}
                    >
                        {tiles.map((tile, index) => {
                            const row = Math.floor(index / width);
                            const column = index % width;
                            const className = getTileClasses(row, column, height);
                            const key = `tile-${index}`;
                            return (
                                <CrosswordTile 
                                    key={key}
                                    ref={(el) => {
                                        if (el) {
                                            tileRefs.current[index] = el;
                                        }
                                    }}
                                    data={tile} 
                                    index={index}
                                    handleAction={handleAction}
                                    className={className} 
                                />
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <section className="flex flex-col">
                        <h2 className="text-lg font-bold">Across</h2>
                        {[...across.entries()].map(([row, data], index) => {
                            const { hint, startIndex } = data;
                            const key = `across-${row}`;
                            return (
                                <CrosswordHint 
                                    key={key}
                                    index={row}
                                    hint={hint}
                                    ref={(el) => {
                                        if (el) {
                                            acrossHintRefs.current[index] = el;
                                        }
                                    }}
                                    onClick={() => {
                                        highlightAcross(startIndex);
                                    }}
                                />
                            );
                        })}
                    </section>
                    <section className="flex flex-col">
                        <h2 className="text-lg font-bold">Down</h2>
                        {[...down.entries()].map(([col, data], index) => {
                            const { hint, startIndex } = data;
                            const key = `down-${col}`;
                            return (
                                <CrosswordHint 
                                    key={key}
                                    index={col}
                                    hint={hint}
                                    ref={(el) => {
                                        if (el) {
                                            downHintRefs.current[index] = el;
                                        }
                                    }}
                                    onClick={() => {
                                        highlightDown(startIndex);
                                    }}
                                />
                            );
                        })}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CrosswordGrid;