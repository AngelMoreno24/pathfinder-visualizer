
class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(node, priority) {
        this.values.push({ node, priority });
        this.values.sort((a, b) => a.priority - b.priority); // Min-Heap (Sort by distance)
    }

    dequeue() {
        return this.values.shift(); // Remove the node with the lowest priority
    }

    isEmpty() {
        return this.values.length === 0;
    }
}



// Heuristic function (Manhattan distance)
const heuristic = (node, goal) => {
    return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
};

export const greedyBestFirstSearch = (grid, startNode, finishNode) => {
    let pq = new PriorityQueue();
    pq.enqueue(startNode, heuristic(startNode, finishNode));

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

// Check neighbors with heuristic priority
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
                neighborNode.previousNode = currentNode;
                let priority = heuristic(neighborNode, finishNode);
                priorityQueue.enqueue(neighborNode, priority);
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