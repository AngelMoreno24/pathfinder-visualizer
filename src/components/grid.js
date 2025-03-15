
  // Function to clear board

  const clearBoard = () => { 

    console.log('asd')
  };
 

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

    while (!pq.isEmpty()) {
        let { node: currentNode } = pq.dequeue();

        // If we reached the finish node, stop early
        if (currentNode === finishNode) break;
        
        if (currentNode.isVisited) continue; // Skip if already visited
        
        currentNode.isVisited = true;
        
        checkNeighbors(grid, currentNode, pq);
    }

    return getShortestPath(finishNode);
};

const checkNeighbors = (grid, currNode, pq) => {
    let { row, col } = currNode;
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];

    for (let [dr, dc] of directions) {
        let nr = row + dr, nc = col + dc;

        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
            let neighbor = grid[nr][nc];

            if (!neighbor.isVisited && neighbor.status !== "selected") {
                let newDistance = currNode.distance + 1; // Assuming uniform weight

                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previousNode = currNode;
                    pq.enqueue(neighbor, newDistance);
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

    return path.reverse(); // Return path from start to finish
};