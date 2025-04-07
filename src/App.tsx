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
  selectedCells: ISet<Point>,
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

  return selectedCells.add(...points, point)
}

function Board({ keys }: { keys: ISet<LowercaseKey> }) {
  let [selectedCells, setSelectedCells] = useState<ISet<Point>>(new ISet())
  let [, setLastSelectedCell] = useState<Point | null>(null)
  return (
    <div className="grid" style={{ '--size': GRID_SIZE }} draggable="false">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
        <div
          draggable="false"
          onMouseDown={() => {
            let point = idxToPoint(i)
            setSelectedCells(new ISet([point]))
            setLastSelectedCell(point)
          }}
          onMouseEnter={() => {
            setLastSelectedCell((lastSelectedCell) => {
              if (!lastSelectedCell) return lastSelectedCell
              // if (keys.has('shift')) {
              // }

              let point = idxToPoint(i)
              // make sure there's an adjacent cell that's selected
              let xDist = Math.abs(lastSelectedCell.x - point.x)
              let yDist = Math.abs(lastSelectedCell.y - point.y)

              if (xDist <= 1 && yDist <= 1) {
                setSelectedCells((cells) => cells.add(point))
                setLastSelectedCell(point)
              } else {
                // we need to fill in the points from the nearest point
                setSelectedCells((cells) =>
                  fillPoints(lastSelectedCell, point, cells),
                )
              }
              return lastSelectedCell
            })
          }}
          onMouseUp={() => {
            setSelectedCells(new ISet())
            setLastSelectedCell(null)
          }}
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
