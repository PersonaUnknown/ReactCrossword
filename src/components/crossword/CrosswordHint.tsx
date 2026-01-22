import type { HintState } from "../../utils/types";
import { getHintHighlightColor, getHintTextColor } from "../../utils/crossword";

interface Props {
    state: HintState;
    onClick: () => void;
}

const CrosswordHint = ({
    state,
    onClick
}: Props) => {
    const { 
        textHighlight,
        highlight,
        hint,
        index
    } = state;
    const textColor = getHintTextColor(textHighlight);
    const backgroundColor = getHintHighlightColor(highlight);
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
}

export default CrosswordHint;