import { useEffect, useState } from 'react'
import type { LowercaseKey } from '@/std/keys'
import ISet from '@/std/ISet'
import './App.css'

type Point = { x: number; y: number }

let GRID_SIZE = 10
function idxToPoint(i: number): Point {
  return { x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE) }
}

function fillPoints(
  lastSelectedPoint: Point,
  point: Point,
  selectedCells: Point[],
) {
  // generate points between the points
  let currentPoint = lastSelectedPoint
  let distX = point.x - currentPoint.x
  let distY = point.y - currentPoint.y
  let max = Math.max(Math.abs(distX), Math.abs(distY))
  let normalized = { x: distX / max, y: distY / max }

  let points = []
  while (
    !(
      Math.round(currentPoint.x) === point.x &&
      Math.round(currentPoint.y) === point.y
    )
  ) {
    points.push({
      x: Math.round(currentPoint.x),
      y: Math.round(currentPoint.y),
    })
    currentPoint.x += normalized.x
    currentPoint.y += normalized.y
    if (
      Math.abs(currentPoint.x) > GRID_SIZE ||
      Math.abs(currentPoint.y) > GRID_SIZE
    )
      throw 'wtf'
  }

  return [...selectedCells, ...points, point]
}

type CellProps = {
  x: number
  y: number
  keys: ISet<LowercaseKey>
  setSelectedCells: (update: ((point: Point[]) => Point[]) | Point[]) => void
  isSelected: boolean
}

function Cell({ x, y, keys, setSelectedCells, isSelected }: CellProps) {
  return (
    <div
      draggable="false"
      onMouseDown={() => setSelectedCells([{ x, y }])}
      onMouseEnter={() => {
        setSelectedCells((selectedCells) => {
          let lastSelectedCell = selectedCells.at(-1)
          if (!lastSelectedCell) return selectedCells
          // make sure there's an adjacent cell that's selected
          let xDist = Math.abs(lastSelectedCell.x - x)
          let yDist = Math.abs(lastSelectedCell.y - y)

          if (keys.has('shift')) {
            if (xDist > 0 && yDist > 0) {
              return selectedCells
            } else if (selectedCells.length > 2) {
              let [first, second] = selectedCells
              if (first.x === second.x) {
                // vertical
                if (xDist !== 0) return selectedCells
              } else {
                // horizontal
                if (yDist !== 0) return selectedCells
              }
            }
          }

          if (xDist <= 1 && yDist <= 1) {
            return [...selectedCells, { x, y }]
          } else {
            // we need to fill in the points from the nearest point
            return fillPoints(lastSelectedCell, { x, y }, selectedCells)
          }
        })
      }}
      onMouseUp={() => setSelectedCells([])}
      className="cell"
      data-selected={isSelected}
      key={`cell-${x}-${y}`}
      style={{ '--pos': x * y }}
    >
      <div className="inner" />
    </div>
  )
}

function Board({ keys }: { keys: ISet<LowercaseKey> }) {
  let [selectedCells, setSelectedCells] = useState<Point[]>([])

  return (
    <div className="grid" style={{ '--size': GRID_SIZE }} draggable="false">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
        let point = idxToPoint(i)
        return (
          <Cell
            key={i}
            keys={keys}
            x={point.x}
            y={point.y}
            isSelected={selectedCells.some(
              ({ x, y }) => x === point.x && y === point.y,
            )}
            setSelectedCells={setSelectedCells}
          />
        )
      })}
    </div>
  )
}

function App() {
  let [keys, setKeys] = useState<ISet<LowercaseKey>>(new ISet())

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      setKeys((keys) => keys.add(e.key.toLowerCase() as LowercaseKey))
    }
    function keyup(e: KeyboardEvent) {
      setKeys((keys) => keys.delete(e.key.toLowerCase() as LowercaseKey))
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
