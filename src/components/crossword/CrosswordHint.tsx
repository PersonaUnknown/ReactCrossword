import { forwardRef, type Ref, useImperativeHandle, useState, } from "react";
import type { CrosswordHintRef } from "../../types/refs";
import { CORRECT_TEXT_COLOR, GRAY_TEXT_COLOR, INCORRECT_TEXT_COLOR, LIGHT_HIGHLIGHT_TILE_COLOR } from "../../utils/crossword";

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
    const [textColor, setTextColor] = useState<string>("#000000");
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
     * Adjust text color based on if the typed guess is correct, incorrect, complete, etc.
     */
    const fadeText = () => {
        setTextColor(GRAY_TEXT_COLOR);
    }
    const onCorrect = () => {
        setTextColor(CORRECT_TEXT_COLOR);
    }
    const onIncorrect = () => {
        setTextColor(INCORRECT_TEXT_COLOR);
    }
    const resetTextColor = () => {
        setTextColor("#000000");
    }
    const onErrorCheckMode = () => {
        switch (textColor) {
            case GRAY_TEXT_COLOR:
            case INCORRECT_TEXT_COLOR:
            case CORRECT_TEXT_COLOR:
                fadeText();
                break;
            default:
                break;
        }
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
        getIndex: getIndex,
        onCorrect: onCorrect,
        onIncorrect: onIncorrect,
        resetTextColor: resetTextColor,
        fadeText: fadeText,
        onErrorCheckMode: onErrorCheckMode
    }));
    return (
        <button 
            type="button"
            onClick={onClick}
            className="text-start cursor-pointer p-1"
            style={{
                backgroundColor: backgroundColor,
                color: textColor
            }}
        >
            {index}. {hint}
        </button>
    );
});

export default CrosswordHint;