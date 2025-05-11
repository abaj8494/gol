const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const ALIVE = 1;
const DEAD = 0;
const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

class Cell {
  constructor() {
    this.currentstate = Math.floor(Math.random() * 2);
    this.total = 0;
  }
  setState(state) {
    this.currentstate = state;
    this.total += state;
  }
}
function buildGrid() {
  return new Array(ROWS).fill(null)
    .map(() => new Array(COLS).fill(null)
    .map(() => new Cell()));
}

let grid = buildGrid();
// interval like we did in snakes
// not like we did in tetris, with manual delta times.
const interval = 50;

setInterval(() => {
  grid = nextGen(grid);
  render(grid);
}, interval);

/* old, super fast way of updating canvas.
requestAnimationFrame(update);

function update() {
  grid = nextGen(grid);
  render(grid);
  requestAnimationFrame(update);
}
*/

function nextGen(grid) {
  //const nextGen = grid.map(arr => [...arr]);
  const currentGen = grid.map(arr => arr.map(cell => cell.currentstate));
  for (let row = 0; row < currentGen.length; row++) {
    for (let col = 0; col < currentGen[row].length; col++) {
      let cell = currentGen[row][col];
      let numNeighbours = 0;
      // calculate the number of neighbours for each cell
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue; // this line is critical, you must
          // not count yourself as a neighbour!
          const x_cell = (ROWS + row + i) % ROWS;
          const y_cell = (COLS + col + j) % COLS;
          const currentNeighbour = currentGen[x_cell][y_cell];
          numNeighbours += currentNeighbour;
          }
        }

      // apply rules based on numNeighbours for each cell
      if (cell === ALIVE && numNeighbours < 2) {
        grid[row][col].setState(0); // underpopulation
      } else if (cell === ALIVE && numNeighbours > 3) { 
        grid[row][col].setState(0); // overpopulation
      } else if (cell === DEAD && numNeighbours === 3) {
        grid[row][col].setState(1); // reproduction 
      } else {
        grid[row][col].setState(grid[row][col].currentstate);
      }
    }
  }
  return grid;
}

function render(grid) {
  let maxTotal = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[col][row];
      if (cell.total > maxTotal) {
        maxTotal = cell.total
      }
    }
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      ctx.beginPath();
      ctx.rect(row * resolution, col * resolution, resolution, resolution);
      //ctx.fillStyle = cell.currentstate ? 'black' : 'white';
      const normalised = cell.total / maxTotal;
      const h = (1.0 - normalised) * 240;
      ctx.fillStyle = `hsl(${h}, 100%, 50%)`
      ctx.fill()
      //ctx.stroke();
    }
  }
}
