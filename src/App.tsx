import { useState } from 'react'
import './App.css'

let GRID_SIZE = 10

function App() {
  let [selectedCells, setSelectedCells] = useState<Set<number>>(new Set())
  return (
    <div className="grid" style={{ '--size': GRID_SIZE }} draggable="false">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
        <div
          draggable="false"
          onMouseDown={() => setSelectedCells(new Set([i]))}
          onMouseEnter={() => {
            if (selectedCells.size === 0) return
            setSelectedCells((cells) => new Set([...cells, i]))
          }}
          onMouseUp={() => setSelectedCells(new Set())}
          className="cell"
          data-selected={selectedCells.has(i)}
          key={`cell-${i}`}
          style={{ '--pos': i }}
        >
          <div className="inner" />
        </div>
      ))}
    </div>
  )
}

export default App
