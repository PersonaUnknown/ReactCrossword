import { IoCaretBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { CrosswordData } from "../../utils/types";
import CrosswordGrid from "./CrosswordGrid";

interface Props {
	data: CrosswordData;
}

/**
 * Main Page to render a crossword puzzle and option to return back to Crossword Puzzle list
 */
const CrosswordPuzzle = ({ data }: Props) => {
	const { title } = data;
	return (
		<div className="max-w-screen min-h-screen container p-6 space-y-2 xl:space-y-4">
			<div>
				<Link
					to={{
						pathname: "/",
					}}
					className="inline-flex flex-row shrink-0 items-center group hover:underline"
					tabIndex={-1}
				>
					<IoCaretBackOutline
						size={20}
						color="black"
						className="group-hover:-translate-x-1 transition-transform duration-100"
					/>
					Back
				</Link>
				<h2 className="text-center font-bold text-2xl xl:text-4xl">{title}</h2>
			</div>
			<div className="flex justify-center">
				<CrosswordGrid data={data} />
			</div>
		</div>
	);
};

export default CrosswordPuzzle;
