class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(node, priority) {
        this.values.push({ node, priority });
        this.values.sort((a, b) => a.priority - b.priority); // Min-Heap (Sort by f-score)
    }

    dequeue() {
        return this.values.shift(); // Remove the node with the lowest f-score
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

// Heuristic function (Manhattan distance)
const heuristic = (node, goal) => {
    return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
};

export const aStarSearch = (grid, startNode, finishNode) => {
    startNode.g = 0; // Cost from start to start is 0
    startNode.f = heuristic(startNode, finishNode); // Initial f-score

    let pq = new PriorityQueue();
    pq.enqueue(startNode, startNode.f);

    let visitedNodesInOrder = [];

    while (!pq.isEmpty()) {
        let { node: currentNode } = pq.dequeue();

        if (currentNode === finishNode) break;
        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        checkNeighbors(grid, currentNode, finishNode, pq);
    }

    const shortestPath = getShortestPath(finishNode);
    return { visitedNodesInOrder, shortestPath };
};

// Explore neighbors with A* cost calculations
const checkNeighbors = (grid, currentNode, finishNode, priorityQueue) => {
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

            if (!neighborNode.isVisited && neighborNode.status !== "selected") {
                let newG = currentNode.g + 1; // Cost from start to neighbor

                if (newG < (neighborNode.g || Infinity)) {
                    neighborNode.g = newG;
                    neighborNode.f = newG + heuristic(neighborNode, finishNode);
                    neighborNode.previousNode = currentNode;
                    priorityQueue.enqueue(neighborNode, neighborNode.f);
                }
            }
        }
    }
};

const getShortestPath = (finishNode) => {
    let path = [];
    let current = finishNode;
    
    while (current) {
        path.push(current);
        current = current.previousNode;
    }

    return path.reverse();
};