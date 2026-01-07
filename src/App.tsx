import './App.css'
import CrosswordGrid from './components/crossword/CrosswordGrid'
import { exampleCrossword } from './utils/crosswordData'

function App() {
  return (
    <div className="min-w-screen min-h-screen container p-6 space-y-4">
      <h2 className="text-center font-bold text-4xl">Example 5x5 Crossword</h2>
      <div className="flex justify-center">
        <CrosswordGrid data={exampleCrossword} />
      </div>
    </div>
  )
}

export default App
