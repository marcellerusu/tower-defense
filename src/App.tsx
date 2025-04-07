import { useEffect, useState } from 'react'
import ISet from '@/std/ISet'
import './App.css'

let GRID_SIZE = 10

function Board({ keys }: { keys: ISet<string> }) {
  let [selectedCells, setSelectedCells] = useState<ISet<number>>(new ISet())
  return (
    <div className="grid" style={{ '--size': GRID_SIZE }} draggable="false">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
        <div
          draggable="false"
          onMouseDown={() => {
            if (keys.has('shift')) setSelectedCells(new ISet([i]))
          }}
          onMouseEnter={() => {
            if (selectedCells.size === 0) return
            setSelectedCells((cells) => cells.add(i))
          }}
          onMouseUp={() => setSelectedCells(new ISet())}
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

function App() {
  let [keys, setKeys] = useState<ISet<string>>(new ISet())

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      setKeys((keys) => keys.add(e.key.toLowerCase()))
    }
    function keyup(e: KeyboardEvent) {
      setKeys((keys) => keys.delete(e.key.toLowerCase()))
    }
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    return () => {
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
    }
  }, [])

  return (
    <main data-key-pressed={keys.join(' ')}>
      <Board keys={keys} />
    </main>
  )
}

export default App
