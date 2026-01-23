import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CrosswordPuzzle from "./components/crossword/CrosswordPuzzle";
import {
	exampleMiniCrossword,
	singleRowCrossword,
} from "./utils/crosswordData";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route
					path="/simple"
					element={<CrosswordPuzzle data={singleRowCrossword} />}
				/>
				<Route
					path="/example"
					element={<CrosswordPuzzle data={exampleMiniCrossword} />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
