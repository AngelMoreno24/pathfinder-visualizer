
  // Function to clear board

  const clearBoard = () => { 

    console.log('asd')
  };
 



  const checkNeighbors = (grid, currNode) => {

    if( grid[point.row-1][point.col-1].isVisited ==  false && grid[point.row-1][point.col-1].status != "selected"){

        grid[point.row-1][point.col-1].isVisited = true
        grid[point.row-1][point.col-1].previousNode = currNode;

    }
    if( grid[point.row-1][point.col+1].isVisited ==  false && grid[point.row-1][point.col+1].status != "selected"){

        grid[point.row-1][point.col+1].isVisited = true
        grid[point.row-1][point.col+1].previousNode = currNode;

    }
    if( grid[point.row+1][point.col+1].isVisited ==  false && grid[point.row+1][point.col+1].status != "selected"){

        grid[point.row+1][point.col+1].isVisited = true
        grid[point.row+1][point.col+1].previousNode = currNode;

    }
    if( grid[point.row+1][point.col-1].isVisited ==  false && grid[point.row+1][point.col-1].status != "selected"){

        grid[point.row+1][point.col-1].isVisited = true
        grid[point.row+1][point.col-1].previousNode = currNode;

    }
  }


  const move = (grid, currNode) => {

  }