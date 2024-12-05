import React from 'react'
import './Node.css'

const Node = ({ row, col, isStart, isFinish, tekanMouse, hoverMouse, handleMouseUp, isWall, previousNode }) => {
  const extraClassname = isStart ? 'node-start' : isFinish ? 'node-finish' : isWall ? 'node-wall' : ''
  return (

    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassname}`}
      onMouseDown={() => tekanMouse(row, col)}
      onMouseEnter={() => hoverMouse(row, col)}
      onMouseUp={handleMouseUp}
    >
      <span>{previousNode}</span>
    </div>
  )
}

export default Node