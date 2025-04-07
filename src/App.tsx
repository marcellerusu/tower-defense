import { useEffect, useState } from 'react'
import ISet from '@/std/ISet'
import './App.css'

type Point = { x: number; y: number }

let GRID_SIZE = 10
function idxToPoint(i: number): Point {
  return { x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE) }
}

function Board() {
  let [selectedCells, setSelectedCells] = useState<ISet<Point>>(new ISet())
  return (
    <div className="grid" style={{ '--size': GRID_SIZE }} draggable="false">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
        <div
          draggable="false"
          onMouseDown={() => setSelectedCells(new ISet([idxToPoint(i)]))}
          onMouseEnter={() => {
            if (selectedCells.size === 0) return
            // detect if there's any cells between us

            setSelectedCells((cells) => cells.add(idxToPoint(i)))
          }}
          onMouseUp={() => setSelectedCells(new ISet())}
          className="cell"
          data-selected={selectedCells.has(idxToPoint(i))}
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
      <Board />
    </main>
  )
}

export default App
