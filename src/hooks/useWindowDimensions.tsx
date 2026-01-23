import { useEffect, useState } from "react";

export interface windowDimensions {
	width: number;
	height: number;
	isMobile: boolean;
}

const getWindowDimensions = (): windowDimensions => {
	const { innerWidth: width, innerHeight: height } = window;
	const isMobile = width < 768;
	return { width, height, isMobile };
};

const useWindowDimensions = () => {
	const [windowDimensions, setWindowDimensions] = useState<windowDimensions>(
		getWindowDimensions(),
	);
	const [tabBarHeight, setTabBarHeight] = useState<number>(
		document.getElementById("top-navbar")?.clientHeight ?? 60,
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowDimensions(getWindowDimensions());
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return { ...windowDimensions, tabBarHeight, setTabBarHeight };
};

export default useWindowDimensions;
