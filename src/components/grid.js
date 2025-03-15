
  // Function to clear board
 

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



export const dijkstra = (grid, startNode, finishNode) => {
    startNode.distance = 0;
    let pq = new PriorityQueue();
    pq.enqueue(startNode, 0);

    let checkedNodesInOrder = []; // Track nodes when first encountered
    let visitedNodesInOrder = []; // Track nodes when officially visited

    while (!pq.isEmpty()) {
        let { node: currentNode } = pq.dequeue();

        if (currentNode === finishNode) break;

        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode); // Mark as officially visited

        checkedNodesInOrder.push(...checkNeighbors(grid, currentNode, pq)); // Push checked neighbors
    }

    const shortestPath = getShortestPath(finishNode);
    return { checkedNodesInOrder, visitedNodesInOrder, shortestPath };
};





const checkNeighbors = (grid, currentNode, priorityQueue) => {
    let { row, col } = currentNode;
    const movementDirections = [
        [0, 1],    // Right
        [1, 0],   // Down
        [0, -1],  // Left
        [-1, 0]  // Up
    ];

    let neighborsChecked = []; // Track nodes that have been checked

    for (let [rowOffset, colOffset] of movementDirections) {
        let neighborRow = row + rowOffset;
        let neighborCol = col + colOffset;

        if (neighborRow >= 0 && neighborRow < grid.length && 
            neighborCol >= 0 && neighborCol < grid[0].length) {
            
            let neighborNode = grid[neighborRow][neighborCol];

            if (!neighborNode.isVisited && neighborNode.status !== "selected") {
                let newDistance = currentNode.distance + 1;

                if (newDistance < neighborNode.distance) {
                    neighborNode.distance = newDistance;
                    neighborNode.previousNode = currentNode;
                    priorityQueue.enqueue(neighborNode, newDistance);
                    neighborsChecked.push(neighborNode); // Track checked nodes
                }
            }
        }
    }

    return neighborsChecked;
};

const getShortestPath = (finishNode) => {
    let path = [];
    let current = finishNode;
    
    while (current) {
        path.push(current);
        current = current.previousNode;
    }

    return path.reverse(); // Return path from start to finish
};