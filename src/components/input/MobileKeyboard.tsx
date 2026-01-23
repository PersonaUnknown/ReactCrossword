import { MobileKeyboardLayout } from "../../utils/keyboardData";
import MobileKeyboardKey from "./MobileKeyboardKey";

interface Props {
	onKeyPress: (char: string) => void;
	onBackspace: () => void;
	onEnter: () => void;
	onSpace: () => void;
}

/**
 * Mobile keyboard
 */
const MobileKeyboard = ({
	onKeyPress,
	onBackspace,
	onEnter,
	onSpace,
}: Props) => {
	return (
		<div className="flex flex-col gap-2">
			{MobileKeyboardLayout.map((row, index) => {
				const key = `row-${index}`;
				return (
					<div key={key} className={"flex gap-2 justify-center"}>
						{row.map((key) => {
							if (key === "Space") {
								return (
									<MobileKeyboardKey
										key={key}
										character={key}
										onClick={onSpace}
									/>
								);
							} else if (key === "BackSpace") {
								return (
									<MobileKeyboardKey
										key={key}
										character={key}
										onClick={onBackspace}
									/>
								);
							} else if (key === "Return") {
								return (
									<MobileKeyboardKey
										key={key}
										character={key}
										onClick={onEnter}
									/>
								);
							}
							return (
								<MobileKeyboardKey
									key={key}
									character={key}
									onClick={onKeyPress}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default MobileKeyboard;
