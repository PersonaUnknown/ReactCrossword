import { IoCaretBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import CrosswordGrid from "./CrosswordGrid";
import type { CrosswordData2 } from "../../../types/types";

interface Props {
    data: CrosswordData2
}

const CrosswordPuzzle = ({
    data
}: Props) => {
    const { title } = data;
    return (
        <div className="min-w-screen min-h-screen container p-6 space-y-4">
            <div>
                <Link
                    to={{
                        pathname: "/",
                    }}
                    className="inline-flex flex-row shrink-0 items-center group hover:underline"
                >
                    <IoCaretBackOutline
                        size={20}
                        color="black"
                        className="group-hover:-translate-x-1 transition-transform duration-100"
                    />
                    Back
                </Link>
                <h2 className="text-center font-bold text-4xl">{title}</h2>
            </div>
            <div className="flex justify-center">
                <CrosswordGrid data={data} />
            </div>
        </div>
    );
}

export default CrosswordPuzzle;