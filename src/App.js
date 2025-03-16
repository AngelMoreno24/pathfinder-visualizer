import { useEffect, useState } from "react";
import "./App.css";
import { dijkstra } from "./components/grid";
import { greedyBestFirstSearch } from "./components/greedy";
import { aStarSearch } from "./components/A-star";

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
        previouseNode: null
      }))
    );
  }; 
 

  // Function to update the grid when moving the start/end cells without clearing walls
  const updateGrid = (newStart, newEnd) => {
    setGridData((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          g: Infinity,  // Reset g-values
          f: Infinity,  // Reset f-values
          status: cell.status === "selected" ? "selected" :
                  cell.row === startCell.row && cell.col === startCell.col ? "start" :
                  cell.row === endCell.row && cell.col === endCell.col ? "end" : "default",
        }))
      )
    );
  };

  // Handle cell selection (walls)
  const toggleCell = (row, col) => {
    if ((row === startCell.row && col === startCell.col) || 
        (row === endCell.row && col === endCell.col)) {
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
      setStartCell({ row, col });
      updateGrid({ row, col }, endCell);
    } else if (draggingType === "end") {
      setEndCell({ row, col });
      updateGrid(startCell, { row, col });
    } else if (isDragging) {
      toggleCell(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingType(null);
  };





  const runDijkstra = () => {
    setGridData((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          status: cell.status === "selected" ? "selected" :
                  cell.row === startCell.row && cell.col === startCell.col ? "start" :
                  cell.row === endCell.row && cell.col === endCell.col ? "end" : "default",
        }))
      );
  
      const startNode = newGrid[startCell.row][startCell.col];
      const endNode = newGrid[endCell.row][endCell.col];
      
      // Run Dijkstra
      const { visitedNodesInOrder, shortestPath } = dijkstra(newGrid, startNode, endNode);

      // Animate checked nodes first, then visited nodes
      animateSearch( visitedNodesInOrder, shortestPath, newGrid);
      
      return newGrid;
    });
  };

  const runGreedy = () => {
    setGridData((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          status: cell.status === "selected" ? "selected" :
                  cell.row === startCell.row && cell.col === startCell.col ? "start" :
                  cell.row === endCell.row && cell.col === endCell.col ? "end" : "default",
        }))
      );
  
      const startNode = newGrid[startCell.row][startCell.col];
      const endNode = newGrid[endCell.row][endCell.col];
      
      // Run Dijkstra
      const { visitedNodesInOrder, shortestPath } = greedyBestFirstSearch(newGrid, startNode, endNode);

      // Animate checked nodes first, then visited nodes
      animateSearch( visitedNodesInOrder, shortestPath, newGrid);
      
      return newGrid;
    });
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
          status: cell.status === "selected" ? "selected" :
                  cell.row === startCell.row && cell.col === startCell.col ? "start" :
                  cell.row === endCell.row && cell.col === endCell.col ? "end" : "default",
        }))
      );
  
      const startNode = newGrid[startCell.row][startCell.col];
      const endNode = newGrid[endCell.row][endCell.col];
      
      // Run Dijkstra
      if(selectedAlgorithm == "dijkstra"){
        const { visitedNodesInOrder, shortestPath } = dijkstra(newGrid, startNode, endNode);

        // Animate checked nodes first, then visited nodes
        animateSearch( visitedNodesInOrder, shortestPath, newGrid);
        
        return newGrid;
      }else if(selectedAlgorithm == "greedy"){      
        const { visitedNodesInOrder, shortestPath } = greedyBestFirstSearch(newGrid, startNode, endNode);

        animateSearch( visitedNodesInOrder, shortestPath, newGrid);
        
        return newGrid;

      }else if(selectedAlgorithm == "A*"){
        const { visitedNodesInOrder, shortestPath } = aStarSearch(newGrid, startNode, endNode);

        animateSearch( visitedNodesInOrder, shortestPath, newGrid);
        
        return newGrid;
      }

    });
  };
  const animateSearch = (visitedNodes, shortestPath) => {
    for (let i = 0; i < visitedNodes.length; i++) {
        setTimeout(() => {
            // Set the current node to orange (checked)
            setGridData((prevGrid) =>
                prevGrid.map((row) =>
                    row.map((cell) =>
                        cell.row === visitedNodes[i].row && cell.col === visitedNodes[i].col
                            ? { ...cell, status: "checked" } // First, mark as checked (orange)
                            : cell
                    )
                )
            );

            // After a delay, switch it to visited (blue)
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
                    animateShortestPath(shortestPath);
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
                    row.map((cell) =>
                        cell.row === shortestPath[i].row && cell.col === shortestPath[i].col
                            ? { ...cell, status: "path"}
                            : cell
                    )
                )
            );
            if (i === shortestPath.length - 1) {
              setIsRunning(false); // 🔹 Re-enable buttons after animation
            }
        }, 25 * i); // Slow animation for visibility
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
            (cell.row === startCell.row && cell.col === startCell.col) ? "start" : 
            (cell.row === endCell.row && cell.col === endCell.col) ? "end" : 
            "default",
        }))
      )
    );
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };


  const startPathfinding = () => {
    console.log(selectedAlgorithm)
    runAlgorithm();
  };

  return (
    <div className="App" onMouseUp={handleMouseUp}>
      <header className="App-header">
        <h1>PathFinder</h1>
        
        <div className="controls-container">
          <select value={selectedAlgorithm} onChange={handleAlgorithmChange} className="dropdown" disabled={isRunning}>
            <option value="dijkstra">Dijkstra</option>
            <option value="A*">A*</option>
            <option value="greedy">Greedy BFS</option>
          </select>

          <button onClick={runAlgorithm} className="action-button" disabled={isRunning}>
            {isRunning ? "Running..." : "Run"}
          </button>
          <button onClick={() => setGridData(createGrid())} className="action-button clear" disabled={isRunning}>Clear Board</button>
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
            overflow: "auto",
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

      <footer className="App-header2"> 
      </footer>
    </div>
  );
}

export default App;