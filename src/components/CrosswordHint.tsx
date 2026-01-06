import { forwardRef, type Ref, useImperativeHandle, useState, } from "react";
import type { CrosswordHintRef } from "../types/refs";
import { LIGHT_HIGHLIGHT_TILE_COLOR } from "../utils/crossword";

interface Props {
    index: number;
    hint: string;
    onClick: () => void;
}

/**
 * Button that shows the hint to a crossword word and highlights that section when clicked on
 */
const CrosswordHint = forwardRef(({
    index,
    hint,
    onClick
}: Props,
    ref: Ref<CrosswordHintRef>
) => {
    const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
    /**
     * Toggle highlighting or unhighlighting on hint background
     */
    const highlight = () => {
        setBackgroundColor(LIGHT_HIGHLIGHT_TILE_COLOR);
    }
    const unhighlight = () => {
        setBackgroundColor("#ffffff");
    }
    /**
     * Getter Functions
     */
    const getIndex = () => {
        return index;
    }
    /**
     * CrosswordHintRef handler
     */
    useImperativeHandle(ref, () => ({
        highlight: highlight,
        unhighlight: unhighlight,
        getIndex: getIndex
    }));
    return (
        <button 
            type="button"
            onClick={onClick}
            className="text-start cursor-pointer py-1"
            style={{
                backgroundColor: backgroundColor
            }}
        >
            {index}. {hint}
        </button>
    );
});

export default CrosswordHint;