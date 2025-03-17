export const depthFirstSearch = (grid, startNode, finishNode) => {
    let stack = [startNode];
    let visitedNodesInOrder = [];

    while (stack.length > 0) {
        let currentNode = stack.pop();
        
        if (currentNode.isVisited) continue; // Skip already visited nodes

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        // If we reach the finish node, stop searching
        if (currentNode === finishNode) break;

        // Explore all valid neighbors in all four directions
        const neighbors = getNeighbors(grid, currentNode);
        for (let neighbor of neighbors) {
            if (!neighbor.isVisited && neighbor.status !== "selected") {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }

    const shortestPath = getShortestPath(finishNode);
    return { visitedNodesInOrder, shortestPath };
};

// Helper function to get valid neighbors (avoids skipping cells)
const getNeighbors = (grid, node) => {
    let { row, col } = node;
    let neighbors = [];
    const directions = [
        [0, -1], // Left
        [1, 0],  // Down
        [0, 1],  // Right
        [-1, 0]  // Up
    ];

    for (let [rowOffset, colOffset] of directions) {
        let newRow = row + rowOffset;
        let newCol = col + colOffset;

        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
};

// Function to backtrack and retrieve the shortest path
const getShortestPath = (finishNode) => {
    let path = [];
    let current = finishNode;

    while (current) {
        path.push(current);
        current = current.previousNode;
    }

    return path.reverse();
};