import { getHintHighlightColor, getHintTextColor } from "../../utils/crossword";
import type { HintState } from "../../utils/types";

interface Props {
	state: HintState;
	onClick: () => void;
}

const CrosswordHint = ({ state, onClick }: Props) => {
	const { textHighlight, highlight, hint, index } = state;
	const textColor = getHintTextColor(textHighlight);
	const backgroundColor = getHintHighlightColor(highlight);
	return (
		<button
			type="button"
			onClick={onClick}
			className="text-start cursor-pointer p-1 w-full"
			style={{
				backgroundColor: backgroundColor,
				color: textColor,
			}}
			role="menuitem"
			tabIndex={-1}
		>
			{index}. {hint}
		</button>
	);
};

export default CrosswordHint;
