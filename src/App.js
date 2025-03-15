import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const rows = 30;
  const cols = 50;

  const [cellSize, setCellSize] = useState(20);
  const [gridData, setGridData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingType, setDraggingType] = useState(null); // "start", "end", or null
  const [startCell, setStartCell] = useState({ row: 5, col: 5 });
  const [endCell, setEndCell] = useState({ row: 25, col: 45 });

  // Function to adjust cell size dynamically
  const updateCellSize = () => {
    const maxWidth = window.innerWidth / cols;
    const maxHeight = window.innerHeight / rows;
    setCellSize(Math.min(maxWidth, maxHeight));
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
        row.map((cell) => {
          if (cell.row === newStart.row && cell.col === newStart.col) {
            return { ...cell, status: "start" };
          } else if (cell.row === newEnd.row && cell.col === newEnd.col) {
            return { ...cell, status: "end" };
          } else if (
            (cell.row === startCell.row && cell.col === startCell.col) ||
            (cell.row === endCell.row && cell.col === endCell.col)
          ) {
            return { ...cell, status: "default" }; // Clear old start/end position
          }
          return cell;
        })
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

  return (
    <div className="App" onMouseUp={handleMouseUp}>
      <header className="App-header">
        <h1>PathFinder</h1>
      </header>

      <main className="App-body">
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
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