import { FaBackspace } from "react-icons/fa";
import { MdKeyboardReturn, MdSpaceBar } from "react-icons/md";

interface Props {
	character: string;
	onClick: ((char: string) => void) | (() => void);
}

/**
 * Interactable key for mobile keyboard
 */
const MobileKeyboardKey = ({ character, onClick }: Props) => {
	const isLetter = character.length === 1 && character !== " ";
	const onKeyPress = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick(character);
		e.preventDefault();
	};
	return (
		<button
			type="button"
			onClick={onKeyPress}
			className="rounded-lg bg-gray-200 px-2 py-1.5 md:p-3 cursor-pointer"
			tabIndex={-1}
		>
			{character === "BackSpace" && <FaBackspace size={20} />}
			{character === "Space" && <MdSpaceBar size={20} />}
			{character === "Return" && <MdKeyboardReturn size={20} />}
			<p className="w-2.5">{isLetter && character}</p>
		</button>
	);
};

export default MobileKeyboardKey;
