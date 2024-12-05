import React, { useEffect, useState } from 'react'
import './PathfindingVisualizer.css'
import Node from '../Nodes/Node'
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra'
import { astar } from '../algorithms/astar'

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([])
    const [mousePressed, setMousePressed] = useState(false)
    const [isAwalDragging, setIsAwalDragging] = useState(false)
    const [isAkhirDragging, setIsAkhirDragging] = useState(false)
    const [titikAwal, setTitikAwal] = useState({ row: 4, col: 4 })
    const [titikAkhir, setTitikAkhir] = useState({ row: 8, col: 45 })
    const [speedVisualization, setSpeedVisualization] = useState(10)

    useEffect(() => {
        const gridFix = buatGridAwal()
        setGrid(gridFix)
    }, [])

    const buatGridAwal = () => {
        const gridAwal = []
        for (let row = 0; row < 20; row++) {
            const rowArray = []
            for (let col = 0; col < 50; col++) {
                rowArray.push(isiNode(col, row))
            }
            gridAwal.push(rowArray)
        }
        return gridAwal
    }

    const isiNode = (col, row) => {
        return {
            row,
            col,
            isStart: row === titikAwal.row && col === titikAwal.col,
            isFinish: row === titikAkhir.row && col === titikAkhir.col,
            distance: Infinity,
            isWall: false,
            isVisited: false,
            previousNode: null,
            totalCost: Infinity,
            heuristic: 0
        }
    }

    const buatRandomWall = (grid, wallCount) => {
        let newGrid = [...grid]

        for (let i = 0; i < wallCount; i++) {
            const randomRow = Math.floor(Math.random() * grid.length)
            const randomCol = Math.floor(Math.random() * grid[0].length)

            if (newGrid[randomRow][randomCol].isStart || newGrid[randomRow][randomCol].isFinish) continue
            newGrid = buatWall(newGrid, randomRow, randomCol)
        }
        return newGrid
    }

    const handleRandomWalls = () => {
        const newGrid = buatRandomWall(grid, 100)
        setGrid(newGrid)
    }

    const buatWall = (grid, row, col) => {
        const newGrid = grid.map((rowArray, rowIdx) => {
            if (row === rowIdx) {
                return rowArray.map((node, colIdx) => {
                    if (col === colIdx) {
                        return ({
                            ...node,
                            isWall: !node.isWall
                        })
                    }
                    return node
                })
            }
            return rowArray
        })
        return newGrid
    }

    const clearWalls = (grid) => {
        const newGrid = grid.map((rowArray) =>
            rowArray.map((node) => ({
                ...node,
                isWall: false
            }))
        )
        return newGrid
    }

    const handleClearWalls = () => {
        const newGrid = clearWalls(grid)
        setGrid(newGrid)
    }

    const visualisasiDijkstra = () => {
        const nodeAwalCoor = grid[titikAwal.row][titikAwal.col]
        const nodeAkhirCoor = grid[titikAkhir.row][titikAkhir.col]
        const visitedNodesInOrder = dijkstra(grid, nodeAwalCoor, nodeAkhirCoor)
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(nodeAkhirCoor);
        animateDijkstraOrAstar(visitedNodesInOrder, nodesInShortestPathOrder)
    }

    const visualisasiAstar = () => {
        const nodeAwalCoor = grid[titikAwal.row][titikAwal.col]
        const nodeAkhirCoor = grid[titikAkhir.row][titikAkhir.col]
        const visitedNodesInOrder = astar(grid, nodeAwalCoor, nodeAkhirCoor)
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(nodeAkhirCoor);
        animateDijkstraOrAstar(visitedNodesInOrder, nodesInShortestPathOrder)
    }

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    };

    const animateDijkstraOrAstar = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, speedVisualization * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, speedVisualization * i);
        }
    }

    const handleMouseDown = (row, col) => {
        if (grid[row][col].isStart) {
            setIsAwalDragging(true)
        } else if (grid[row][col].isFinish) {
            setIsAkhirDragging(true)
        } else if (!grid[row][col].isStart && !grid[row][col].isFinish) {
            const newGrid = buatWall(grid, row, col)
            setGrid(newGrid)
        }
        setMousePressed(true)
    }

    const handleMouseEnter = (row, col) => {
        if (isAwalDragging) {
            const newStart = { row, col }
            setTitikAwal(newStart)
            const newgrid = grid.map((rowArray) =>
                rowArray.map((node) => ({
                    ...node,
                    isStart: node.row === newStart.row && node.col === newStart.col
                }))
            )
            setGrid(newgrid)
        } else if (isAkhirDragging) {
            const newFinish = { row, col }
            setTitikAkhir(newFinish)
            const newGrid = grid.map((rowArray) => (
                rowArray.map((node) => ({
                    ...node,
                    isFinish: node.row === newFinish.row && node.col === newFinish.col
                }))
            ))
            setGrid(newGrid)
        } else if (mousePressed) {
            const newGrid = buatWall(grid, row, col)
            setGrid(newGrid)
        }
    }

    const handleMouseUp = () => {
        setIsAwalDragging(false)
        setIsAkhirDragging(false)
        setMousePressed(false)
    }

    return (
        <div>
            <div className='flex justify-center items-center mt-16 mb-16'>
                <button onClick={visualisasiDijkstra} className='rounded-lg px-16 py-6 bg-black text-neutral-300 hover:bg-gray-800 mx-5 '>
                    <span className='text-2xl'>Visualisasi Dijkstra</span>
                </button>
                <button onClick={visualisasiAstar} className='rounded-lg px-16 py-6 bg-black text-neutral-300 hover:bg-gray-800 mx-5 '>
                    <span className='text-2xl'>Visualisasi A-star</span>
                </button>
                <button onClick={handleRandomWalls} className='rounded-lg px-16 py-6 bg-black text-neutral-300 hover:bg-gray-800 mx-5 '>
                    <span className='text-2xl'>Create Random Walls</span>
                </button>
                <button onClick={handleClearWalls} className='rounded-lg px-16 py-6 bg-black text-neutral-300 hover:bg-red-800 mx-5 '>
                    <span className='text-2xl'>Clear Walls!</span>
                </button>
                <label className="flex flex-col">
                    <span className='text-2xl'>Choose the Speed</span>
                    <div className="flex items-center">
                        <select
                            className="border rounded p-2 w-48 text-2xl"
                            value={speedVisualization}
                            onChange={(e) => setSpeedVisualization(e.target.value)}
                        >
                            <option value={1}>fast</option>
                            <option value={5}>medium</option>
                            <option value={10}>slow</option>
                        </select>
                    </div>
                </label>

            </div>
            <div className='grid'>
                {grid.map((tiapGrid, rowIdx) => (
                    <div key={rowIdx} >
                        {tiapGrid.map((titik, colIdx) => {
                            const { row, col, isStart, isFinish, isWall } = titik
                            return (
                                <Node
                                    key={colIdx}
                                    row={row}
                                    col={col}
                                    isStart={isStart}
                                    isFinish={isFinish}
                                    tekanMouse={() => handleMouseDown(row, col)}
                                    hoverMouse={() => handleMouseEnter(row, col)}
                                    handleMouseUp={handleMouseUp}
                                    isWall={isWall}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>

        </div>

    )
}

export default PathfindingVisualizer