import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import type { CrosswordGridAction } from "../../../types/types";
import { twMerge } from "tailwind-merge";

interface Props {
    hasWon: boolean;
    canEdit: boolean;
    setCanEdit: React.Dispatch<React.SetStateAction<boolean>>;
    handleAction: (call: CrosswordGridAction) => void;
}

/**
 * Menu that provides user with helpful functions to go with crossword puzzle
 */
const CrosswordMenu = ({
    hasWon,
    canEdit,
    setCanEdit,
    handleAction
}: Props) => {
    /*
        [x] Checks if letter is correct
        [x] Checks if word is correct
        [x] Checks if entire grid is correct
        [] Reveals current letter
        [] Reveals current word
        [] Reveals entire grid and ends game
     */
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openMenu = () => {
        if (hasWon) {
            return;
        }
        setCanEdit(false);
        setIsOpen(true); 
    }
    const closeMenu = useCallback(() => {
        setCanEdit(true);
        setIsOpen(false); 
    }, []);
    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    useEffect(() => {
        if (canEdit) { 
            closeMenu();
        }
    }, [canEdit, closeMenu]);
    return (
        <div 
            className="relative"
        >
            <button
                className={twMerge(
                    "flex flex-row items-center gap-1 hover:bg-[#dedede] transition-colors duration-100 ease-in px-3 py-2 cursor-pointer",
                    isOpen && "bg-[#dedede]",
                )}
                type="button"  
                onClick={toggleMenu}
            >
                Assist
                <IoIosArrowDown size={15} />
            </button>
            {isOpen && (
                <div 
                    className="absolute flex flex-col p-2 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] bg-white cursor-pointer right-0 w-max"
                    style={{
                        zIndex: isOpen ? 30 : 0
                    }}
                >
                    <button
                        type="button"
                        className="hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b border-[#ccc]"
                        onClick={() => {
                            handleAction({
                                action: "revealLetter",
                                parameter: null
                            });
                            closeMenu();
                        }}
                    >
                        Reveal Letter
                    </button>
                    <button
                        type="button"
                        className="hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b-2 border-[#ccc]"
                        onClick={() => {
                            handleAction({
                                action: "revealWord",
                                parameter: null
                            });
                            closeMenu();
                        }}
                    >
                        Reveal Word
                    </button>
                    <button
                        type="button"
                        className="hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b-2 border-[#ccc]"
                        onClick={() => {
                            handleAction({
                                action: "revealGrid",
                                parameter: null
                            });
                            closeMenu();
                        }}
                    >
                        Reveal Grid
                    </button>
                    <button
                        type="button"
                        className="hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b-2 border-[#ccc]"
                        onClick={() => {
                            handleAction({
                                action: "checkLetter",
                                parameter: null
                            });
                            closeMenu();
                        }}
                    >
                        Check Letter
                    </button>
                    <button
                        type="button"
                        className="hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer border-b-2 border-[#ccc]"
                        onClick={() => {
                            handleAction({
                                action: "checkWord",
                                parameter: null
                            });
                            closeMenu();
                        }}
                    >
                        Check Word
                    </button>
                    <button
                        type="button"
                        className="hover:bg-[#f0f0f0] px-2 py-3 cursor-pointer"
                        onClick={() => {
                            handleAction({
                                action: "checkGrid",
                                parameter: null
                            });
                            closeMenu();
                        }}
                    >
                        Check Grid
                    </button>
                </div>
            )}
        </div>
    );
}

export default CrosswordMenu;