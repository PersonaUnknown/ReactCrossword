import { IoIosArrowForward } from "react-icons/io";

/**
 * Main page, compiling list of Crossword Puzzles
 */
const HomePage = () => {
	document.body.style.overflow = "auto";
	return (
		<div className="min-h-screen p-4 manrope space-y-2 md:space-y-4">
			<h1 className="text-center text-2xl md:text-4xl"> Crossword Puzzles </h1>
			<section className="flex flex-col gap-2 md:w-2xl lg:w-4xl mx-auto">
				<a
					href="/simple"
					className="flex flex-row justify-between items-center w-full gap-2 hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b-2 border-[#ccc]"
				>
					<div className="flex flex-col">
						<h2 className="font-bold text-lg">Simple Puzzle</h2>
						<p>A single row crossword</p>
					</div>
					<IoIosArrowForward size={25} />
				</a>
				<a
					href="/example"
					className="flex flex-row justify-between items-center w-full gap-2 hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b-2 border-[#ccc]"
				>
					<div className="flex flex-col">
						<h2 className="font-bold text-lg">Example Puzzle</h2>
						<p>5x5 Mini Crossword</p>
					</div>
					<IoIosArrowForward size={25} />
				</a>
			</section>
		</div>
	);
};

export default HomePage;
