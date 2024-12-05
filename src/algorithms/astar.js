export const astar = (grid, titikAwal, titikAkhir) => {
    const visitedNodesInOrder = [];
    titikAwal.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    titikAwal.heuristic = heuristic(titikAwal, titikAkhir);             // "kompas" ke target
    titikAwal.totalCost = titikAwal.distance + titikAwal.heuristic;     // untuk comparassion, return angka

    while (unvisitedNodes.length > 0) {
        sortNodesByTotalCost(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;

        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === titikAkhir) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid, titikAkhir);
    }
};

const sortNodesByTotalCost = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost);    //sort by totalCost
};

const heuristic = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);   //manhatan distance
};

// node menerima closestNode
// neighbor, berasal dari neighbors closestNode
const updateUnvisitedNeighbors = (node, grid, titikAkhir) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const tentativeDistance = node.distance + 1
        if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance;
            neighbor.heuristic = heuristic(neighbor, titikAkhir);
            neighbor.totalCost = neighbor.distance + neighbor.heuristic;
            neighbor.previousNode = node;
        }
    }
};

const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;

    // Check bounds and push neighbors
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    // Filter out visited neighbors
    return neighbors.filter(neighbor => !neighbor.isVisited);
};

const getAllNodes = (grid) => {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};


export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

