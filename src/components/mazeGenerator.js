export const generateMaze = (grid, rows, cols, startCell, endCell) => {
    let newGrid = grid.map(row => row.map(cell => ({ ...cell, status: "selected" }))); // Set all cells as walls
  
    // Recursive DFS Maze Generation
    const carvePath = (row, col) => {
      const directions = [
        [0, -2], // Left
        [0, 2],  // Right
        [-2, 0], // Up
        [2, 0]   // Down
      ];
  
      shuffleArray(directions); // Randomize directions
  
      for (let [rowOffset, colOffset] of directions) {
        let newRow = row + rowOffset;
        let newCol = col + colOffset;
  
        if (newRow > 0 && newRow < rows - 1 && newCol > 0 && newCol < cols - 1 && newGrid[newRow][newCol].status === "selected") {
          // Carve out path
          newGrid[row][col].status = "default";
          newGrid[newRow][newCol].status = "default";
  
          // Remove wall between the two cells
          newGrid[row + rowOffset / 2][col + colOffset / 2].status = "default";
  
          carvePath(newRow, newCol);
        }
      }
    };
  
    // Pick a random starting point (odd indices to ensure walls around the edges)
    let startRow = 1;
    let startCol = 1;
    newGrid[startRow][startCol].status = "default";
  
    carvePath(startRow, startCol);
  
    // Ensure the start and end points remain open
    newGrid[startCell.row][startCell.col].status = "start";
    newGrid[endCell.row][endCell.col].status = "end";
  
    return newGrid;
  };
  
  // Utility function to shuffle an array 
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };