import { useEffect, useState } from 'react'
import ISet from '@/std/ISet'
import './App.css'

type Point = { x: number; y: number }

let GRID_SIZE = 10
function idxToPoint(i: number): Point {
  return { x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE) }
}

function fillPoints(point: Point, selectedCells: ISet<Point>) {
  // first find the nearest point
  let nearestPoint: { point: Point; dist: number } | null = null
  for (let { x, y } of selectedCells) {
    let dist = Math.abs(x - point.x) + Math.abs(y - point.y)
    if (!nearestPoint || nearestPoint.dist > dist)
      nearestPoint = { point: { x, y }, dist }
  }
  if (!nearestPoint) throw 'no points'

  // generate points between the points
  let currentPoint = nearestPoint.point
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
  return selectedCells.add(...points)
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
            let point = idxToPoint(i)
            // make sure there's an adjacent cell that's selected
            let hasAdjacentCell = selectedCells.some(({ x, y }) => {
              let xDist = Math.abs(x - point.x)
              let yDist = Math.abs(y - point.y)
              return xDist <= 1 && yDist <= 1
            })
            if (hasAdjacentCell) {
              setSelectedCells((cells) => cells.add(point))
            } else {
              // we need to fill in the points from the nearest point
              setSelectedCells((cells) => fillPoints(point, cells))
            }
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
