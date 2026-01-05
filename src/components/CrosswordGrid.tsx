import { useEffect, useRef, useState } from "react";
import type { CrosswordTileRef } from "../types/refs";
import type { CrosswordData, CrosswordGridAction } from "../types/types";
import { getColumnIndices, getRowIndices, getTileClasses, LARGE_TILE_SIZE } from "../utils/crossword";
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
        acrossHints,
        downHints
    } = data;
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [direction, setDirection] = useState<"across" | "down">("across");
    const tileRefs = useRef<CrosswordTileRef[]>([]);
    const highlightedTileIndices = useRef<number[]>([]);
    /**
     * Highlight across or down tiles
     */
    const highlight = (index: number) => {
        const selectedTileState = tileRefs.current[index].getState();
        const acrossIndex = tileRefs.current[index].getAcrossWordIndex();
        const downIndex = tileRefs.current[index].getDownWordIndex();
        switch (selectedTileState) {
            case "idle":
                if (direction === "across") {
                    if (across.has(acrossIndex)) {
                        highlightAcross(index);
                    } else {
                        highlightDown(index);
                    }
                } else {
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
            case "type":
                break;
        }
    }
    /**
     * Init crossword to highlight first possible across word
     */
    useEffect(() => {
        const highlightFirstAcross = () => {
            for (let i = 0; i < tiles.length; i++) {
                const across = tiles[i].across;
                if (across > 0) {
                    highlightAcross(i);
                    return;
                }
            }
        }
        highlightFirstAcross();
    }, []);
    return (
        <div className="p-4 select-none">
            <div className="flex flex-row gap-8">
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
                    <section>
                        <h2 className="text-lg font-bold">Across</h2>
                        {[...acrossHints.entries()].map(([row, hint]) => {
                            const key = `across-${row}`;
                            return (
                                <div key={key}>
                                    {row}. {hint}
                                </div>
                            );
                        })}
                    </section>
                    <section>
                        <h2 className="text-lg font-bold">Down</h2>
                        {[...downHints.entries()].map(([row, hint]) => {
                            const key = `down-${row}`;
                            return (
                                <div key={key}>
                                    {row}. {hint}
                                </div>
                            );
                        })}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CrosswordGrid;