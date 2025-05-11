const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const ALIVE = 1;
const DEAD = 0;
const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid() {
  return new Array(ROWS).fill(null)
    .map(() => new Array(COLS).fill(null)
    .map(() => Math.floor(Math.random() * 2)));
}

let grid = buildGrid();
// interval like we did in snakes
// not like we did in tetris, with manual delta times.
const interval = 100;

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
  const nextGen = grid.map(arr => [...arr]);
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      let numNeighbours = 0;
      // calculate the number of neighbours for each cell
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue; // this line is critical, you must
          // not count yourself as a neighbour!
          const x_cell = (ROWS + row + i) % ROWS;
          const y_cell = (COLS + col + j) % COLS;
          const currentNeighbour = grid[x_cell][y_cell];
          numNeighbours += currentNeighbour;
          }
        }

      // apply rules based on numNeighbours for each cell
      if (cell === ALIVE && numNeighbours < 2) {
        nextGen[row][col] = DEAD; // underpopulation
      } else if (cell === ALIVE && numNeighbours > 3) { 
        nextGen[row][col] = DEAD; // overpopulation
      } else if (cell === DEAD && numNeighbours === 3) {
        nextGen[row][col] = ALIVE; // reproduction 
      }
    }
  }
  return nextGen;
}

function render(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      ctx.beginPath();
      ctx.rect(row * resolution, col * resolution, resolution, resolution);
      ctx.fillStyle = cell ? 'black' : 'white';
      ctx.fill()
      //ctx.stroke();
    }
  }
}
