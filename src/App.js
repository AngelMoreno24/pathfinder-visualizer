import { useEffect, useState } from "react";
import "./App.css";
import { dijkstra } from "./components/grid";
import { greedyBestFirstSearch } from "./components/greedy";
import { aStarSearch } from "./components/A-star";
import { depthFirstSearch } from "./components/dfs";
import { generateMaze } from "./components/mazeGenerator";
function App() {
  const rows = 30;
  const cols = 50;

  const [cellSize, setCellSize] = useState(20);
  const [gridData, setGridData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingType, setDraggingType] = useState(null); // "start", "end", or null
  const [startCell, setStartCell] = useState({ row: 12, col: 15 });
  const [endCell, setEndCell] = useState({ row: 12, col: 35 });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra"); // Default algorithm

  const [isRunning, setIsRunning] = useState(false);

  // Function to adjust cell size dynamically
  const updateCellSize = () => {
    const maxWidth = Math.min(window.innerWidth * 0.9, 1200) / cols; // Limit width
    const maxHeight = Math.min(window.innerHeight * 0.8, 800) / rows; // Limit height
    setCellSize(Math.max(15, Math.min(maxWidth, maxHeight))); // Keep size reasonable
  };

  // Initialize grid state once (persistent walls, no reset)
  useEffect(() => {
    updateCellSize();
    setGridData(createGrid());
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  // Function to create an initial grid (without clearing selected walls)
  const createGrid = () => {
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        row,
        col,
        status:
          row === startCell.row && col === startCell.col
            ? "start"
            : row === endCell.row && col === endCell.col
            ? "end"
            : "default",
        distance: Infinity,
        isVisited: false,
        previousNode: null
      }))
    );
  };

  const updateGrid = (newStart, newEnd) => {
    setGridData((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          g: Infinity,
          f: Infinity,
          status:
            cell.status === "selected"
              ? "selected"
              : cell.row === newStart.row && cell.col === newStart.col
              ? "start"
              : cell.row === newEnd.row && cell.col === newEnd.col
              ? "end"
              : "default"
        }))
      )
    );
  };

  // Handle cell selection (walls)
  const toggleCell = (row, col) => {
    if (
      (row === startCell.row && col === startCell.col) ||
      (row === endCell.row && col === endCell.col)
    ) {
      return; // Prevent selecting start or end cells as walls
    }

    setGridData((prevGrid) =>
      prevGrid.map((r) =>
        r.map((cell) =>
          cell.row === row && cell.col === col
            ? { ...cell, status: cell.status === "selected" ? "default" : "selected" }
            : cell
        )
      )
    );
  };

  // Mouse event handlers
  const handleMouseDown = (row, col) => {
    if (row === startCell.row && col === startCell.col) {
      setDraggingType("start");
    } else if (row === endCell.row && col === endCell.col) {
      setDraggingType("end");
    } else {
      setIsDragging(true);
      toggleCell(row, col);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (draggingType === "start") {
      setStartCell((prevStart) => {
        const newStart = { row, col };
        updateGrid(newStart, endCell); // Ensure latest endCell
        return newStart;
      });
    } else if (draggingType === "end") {
      setEndCell((prevEnd) => {
        const newEnd = { row, col };
        updateGrid(startCell, newEnd); // Ensure latest startCell
        return newEnd;
      });
    } else if (isDragging) {
      toggleCell(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingType(null);
  };

  const runAlgorithm = () => {
    if (isRunning) return; // Prevent multiple clicks while running

    setIsRunning(true); // Disable buttons

    setGridData((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          status:
            cell.status === "selected"
              ? "selected"
              : cell.row === startCell.row && cell.col === startCell.col
              ? "start"
              : cell.row === endCell.row && cell.col === endCell.col
              ? "end"
              : "default"
        }))
      );

      const startNode = newGrid[startCell.row][startCell.col];
      const endNode = newGrid[endCell.row][endCell.col];

      // Run the selected algorithm
      if (selectedAlgorithm === "dijkstra") {
        const { visitedNodesInOrder, shortestPath } = dijkstra(newGrid, startNode, endNode);
        animateSearch(visitedNodesInOrder, shortestPath, newGrid);
      } else if (selectedAlgorithm === "greedy") {
        const { visitedNodesInOrder, shortestPath } = greedyBestFirstSearch(newGrid, startNode, endNode);
        animateSearch(visitedNodesInOrder, shortestPath, newGrid);
      } else if (selectedAlgorithm === "A*") {
        const { visitedNodesInOrder, shortestPath } = aStarSearch(newGrid, startNode, endNode);
        animateSearch(visitedNodesInOrder, shortestPath, newGrid);
      } else if (selectedAlgorithm === "dfs") {
        const { visitedNodesInOrder, shortestPath } = depthFirstSearch(newGrid, startNode, endNode);
        animateSearch(visitedNodesInOrder, shortestPath, newGrid);
      }

      return newGrid;
    });
  };

  const animateSearch = (visitedNodes, shortestPath) => {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
          setGridData((prevGrid) =>
              prevGrid.map((row) =>
                  row.map((cell) => {
                      // Keep the start cell green
                      if (cell.row === startCell.row && cell.col === startCell.col) {
                          return { ...cell, status: "start" }; // Keep start cell green
                      }

                      // Keep the end cell blue
                      if (cell.row === endCell.row && cell.col === endCell.col) {
                          return { ...cell, status: "end" }; // Keep end cell blue
                      }

                      // Set visited nodes to orange
                      if (cell.row === visitedNodes[i].row && cell.col === visitedNodes[i].col) {
                          return { ...cell, status: "checked" }; // Mark as checked (orange)
                      }

                      return cell; // Otherwise, return the cell as is
                  })
              )
          );

          // After a delay, switch checked nodes to visited (blue)
          setTimeout(() => {
              setGridData((prevGrid) =>
                  prevGrid.map((row) =>
                      row.map((cell) =>
                          cell.row === visitedNodes[i].row && cell.col === visitedNodes[i].col
                              ? { ...cell, status: "visited" } // Change to visited (blue)
                              : cell
                      )
                  )
              );

              // If it's the last visited node, animate the shortest path
              if (i === visitedNodes.length - 1) {
                  animateShortestPath(shortestPath); // Animate shortest path after visiting all nodes
              }
          }, 5); // Delay before switching to blue

      }, 10 * i); // Delay each node animation
    }
  };





  const animateShortestPath = (shortestPath) => {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
          setGridData((prevGrid) =>
              prevGrid.map((row) =>
                  row.map((cell) => {
                      // Skip the start cell from being overwritten and keep it green
                      if (cell.row === startCell.row && cell.col === startCell.col) {
                          return { ...cell, status: "start" }; // Keep start cell green
                      }

                      // Skip the end cell from being overwritten and keep it blue (or your custom color)
                      if (cell.row === endCell.row && cell.col === endCell.col) {
                          return { ...cell, status: "end" }; // Keep end cell blue
                      }

                      // Mark path cells (the cells in the shortest path)
                      if (cell.row === shortestPath[i].row && cell.col === shortestPath[i].col) {
                          return { ...cell, status: "path" }; // Mark as path cell
                      }

                      return cell; // Otherwise, return the cell as is
                  })
              )
          );
          if (i === shortestPath.length - 1) {
              setIsRunning(false); // Re-enable buttons after animation finishes
          }
      }, 10 * i); // Slow animation for visibility
    }
  };




  const clearBoard = () => {
    setGridData((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          status:
            cell.row === startCell.row && cell.col === startCell.col
              ? "start"
              : cell.row === endCell.row && cell.col === endCell.col
              ? "end"
              : "default" // Keep start and end cells intact
        }))
      )
    );
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };




  const handleGenerateMaze = () => {
    setGridData(prevGrid => generateMaze(prevGrid, rows, cols, startCell, endCell));
  };






  return (
    <div className="App" onMouseUp={handleMouseUp}>
      <header className="App-header">
        <h1>PathFinding Visualizer</h1>

        <div className="controls-container">
          <button
          onClick={handleGenerateMaze}
          className="action-button"
          disabled={isRunning}
        >
          Generate Maze
        </button>
          <select
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
            className="dropdown"
            disabled={isRunning}
          >
            <option value="dijkstra">Dijkstra</option>
            <option value="A*">A*</option>
            <option value="greedy">Greedy BFS</option>
            <option value="dfs">DFS</option>
          </select>

          <button onClick={runAlgorithm} className="action-button" disabled={isRunning}>
            {isRunning ? "Running..." : "Run"}
          </button>
          <button
            onClick={() => setGridData(createGrid())}
            className="action-button clear"
            disabled={isRunning}
          >
            Clear Board
          </button>
        </div>
      </header>

      <main className="App-body">
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(15px, ${cellSize}px))`,
            gridTemplateRows: `repeat(${rows}, minmax(15px, ${cellSize}px))`,
            maxWidth: "90vw",
            maxHeight: "80vh",
            overflow: "auto"
          }}
        >
          {gridData.map((row) =>
            row.map((cell) => (
              <div
                key={`${cell.row}-${cell.col}`}
                className={`cell ${cell.status}`}
                onMouseDown={() => handleMouseDown(cell.row, cell.col)}
                onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
                style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
              ></div>
            ))
          )}
        </div>
      </main>

      <footer className="App-header2"></footer>
    </div>
  );
}

export default App;