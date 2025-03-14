import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const rows = 30;
  const cols = 50;
  
  const [cellSize, setCellSize] = useState(20);
  const [gridData, setGridData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Function to adjust cell size dynamically
  const updateCellSize = () => {
    const maxWidth = window.innerWidth / cols;
    const maxHeight = window.innerHeight / rows;
    setCellSize(Math.min(maxWidth, maxHeight));
  };

  // Function to create grid
  const createGrid = () => {
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        row,
        col,
        status: "default",
      }))
    );
  };

  // Initialize grid state (persistent on resize)
  useEffect(() => {
    updateCellSize();
    setGridData(createGrid());
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  // Function to toggle a cell
  const toggleCell = (row, col) => {
    setGridData((prevGrid) =>
      prevGrid.map((r, rIndex) =>
        r.map((cell, cIndex) =>
          rIndex === row && cIndex === col
            ? { ...cell, status: cell.status === "selected" ? "default" : "selected" }
            : cell
        )
      )
    );
  };

  // Mouse event handlers
  const handleMouseDown = (row, col) => {
    setIsDragging(true);
    toggleCell(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (isDragging) {
      toggleCell(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
                className={`cell ${cell.status === "selected" ? "selected" : ""}`}
                onMouseDown={() => handleMouseDown(cell.row, cell.col)}
                onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
                style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
              ></div>
            ))
          )}
        </div>
      </main>

      <footer className="App-header2">
        <h1>PathFinder</h1>
      </footer>
    </div>
  );
}

export default App;