import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { MdClose, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import type { CrosswordSettings } from "../../types/types";

interface Props {
    settings: CrosswordSettings;
    setSettings: React.Dispatch<React.SetStateAction<CrosswordSettings>>;
    setCanEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Settings button that opens a 
 */
const CrosswordSettingsButton = ({
    settings,
    setSettings,
    setCanEdit
}: Props) => {
    const [tempSettings, setTempSettings] = useState<CrosswordSettings>(settings);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openModal = () => { 
        setCanEdit(false);
        setIsOpen(true); 
    }
    const closeModal = () => { 
        setCanEdit(true);
        setIsOpen(false); 
    }
    const toggleErrorCheckMode = () => {
        const newSettings = { ...tempSettings };
        newSettings.errorCheckMode = !newSettings.errorCheckMode;
        setTempSettings(newSettings);
    }
    const applySettings = () => {
        const newSettings = { ...tempSettings };
        setSettings(newSettings);
        closeModal();
    }
    return (
        <>
            <div className="flex justify-end">
                <button 
                    type="button" 
                    className="cursor-pointer"
                    onClick={openModal}
                >
                    <IoMdSettings size={25} />
                </button>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            className="absolute inset-0 bg-[#00000080] z-10" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        /> 
                        <motion.div 
                            className="absolute top-5 left-1/2 -translate-x-1/2 bg-white p-4 flex flex-col justify-center w-3xs sm:w-sm z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div className="flex flex-row justify-between">
                                <h2 className="text-2xl font-bold text-left"> Settings </h2>
                                <button 
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={closeModal}
                                >
                                    <MdClose size={20} />
                                </button>
                            </div>
                            <div className="w-full h-0.5 bg-[#E9E9E9] my-4"/>
                            <div className="flex flex-row gap-4 justify-between items-center">
                                <div className="flex flex-col text-left">
                                    <h3 className="font-bold"> Error check mode </h3>
                                    <p className="text-[#666]"> Marks incorrect letters with a diagonal line</p>
                                </div>
                                <button 
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={toggleErrorCheckMode}
                                >
                                    {
                                        tempSettings.errorCheckMode ?
                                            <MdOutlineCheckBox size={20} /> :
                                            <MdOutlineCheckBoxOutlineBlank size={20} />
                                    }
                                </button>
                            </div>
                            <div className="w-full h-0.5 bg-[#E9E9E9] my-4"/>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-lg bg-yellow-300 hover:bg-black text-black hover:text-white transition-colors duration-100 ease-in px-3 py-2 cursor-pointer"
                                    onClick={applySettings}
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default CrosswordSettingsButton;