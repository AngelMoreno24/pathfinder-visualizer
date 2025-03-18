class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(node, priority) {
        this.values.push({ node, priority });
        this.values.sort((a, b) => a.priority - b.priority); // Min-Heap (Replace with a binary heap for efficiency)
    }

    dequeue() {
        return this.values.shift(); // Remove the node with the lowest f-score
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

// Manhattan Distance Heuristic (Used in A*)
const heuristic = (node, goal) => {
    return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
};

// **FIXED A* Search Algorithm**
export const aStarSearch = (grid, startNode, finishNode) => {
    // Reset grid state before running A*
    grid.forEach(row => {
        row.forEach(cell => {
            cell.g = Infinity;
            cell.f = Infinity;
            cell.previousNode = null;
            cell.isVisited = false;
        });
    });

    startNode.g = 0; // Cost from start to start is 0
    startNode.f = heuristic(startNode, finishNode); // Initial f-score

    let pq = new PriorityQueue();
    pq.enqueue(startNode, startNode.f);

    let visitedNodesInOrder = [];
    let processedNodes = new Set(); // Track fully processed nodes

    while (!pq.isEmpty()) {
        let { node: currentNode } = pq.dequeue();

        if (processedNodes.has(currentNode)) continue; // Avoid redundant processing
        processedNodes.add(currentNode);

        // **FIXED**: Compare by row/col instead of object reference
        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            return {
                visitedNodesInOrder,
                shortestPath: getShortestPath(finishNode)
            };
        }

        visitedNodesInOrder.push(currentNode);
        currentNode.isVisited = true;

        checkNeighbors(grid, currentNode, finishNode, pq, processedNodes);
    }

    const shortestPath = getShortestPath(finishNode);
    return { visitedNodesInOrder, shortestPath }; // No path found
};

// **Explore neighbors with A* cost calculations**
const checkNeighbors = (grid, currentNode, finishNode, priorityQueue, processedNodes) => {
    let { row, col } = currentNode;
    const movementDirections = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0]  // Up
    ];

    for (let [rowOffset, colOffset] of movementDirections) {
        let neighborRow = row + rowOffset;
        let neighborCol = col + colOffset;

        if (neighborRow >= 0 && neighborRow < grid.length && 
            neighborCol >= 0 && neighborCol < grid[0].length) {
            
            let neighborNode = grid[neighborRow][neighborCol];

            if (!processedNodes.has(neighborNode) && neighborNode.status !== "selected") {
                let newG = currentNode.g + 1; // Cost from start to neighbor

                if (newG < neighborNode.g) {
                    neighborNode.g = newG;
                    neighborNode.f = newG + heuristic(neighborNode, finishNode);
                    neighborNode.previousNode = currentNode;
                    priorityQueue.enqueue(neighborNode, neighborNode.f);
                }
            }
        }
    }
};

// **Reconstruct shortest path**
const getShortestPath = (finishNode) => {
    let path = [];
    let current = finishNode;
    
    while (current) {
        path.push(current);
        current = current.previousNode;
    }

    return path.reverse();
};