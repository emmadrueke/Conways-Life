//Implementation of Conway's Game of Life

//Make a 2d Array helper function

function Array2D(width, height) {
  let a = new Array(height);

  for (let i = 0; i < height; i++) {
    a[i] = new Array(width);
  }
  return a;
}

class Life {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.currentBufferIndex = 0;
    //Double buffer
    this.buffer = [
      Array2D(width, height),
      Array2D(width, height),
    ]
    this.clear();
  }

  getCells() {
    return this.buffer[this.currentBufferIndex];
  }
  //Kill Everything
  clear() {
    for (let y = 0; y < this.height; y++) {
      this.buffer[this.currentBufferIndex][y].fill(0);
    }
  }

  randomize() {
    let buffer = this.buffer[this.currentBufferIndex];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        buffer[y][x] = (Math.random() *2)|0; //Random 0 or 1
      }
    }
  }

  //Run the simulation for a single step

  step() {
    //fill the backBuffer with the next life generation
    //from the current buffer

    let backBufferIndex = this.currentBufferIndex ===0 ? 1 : 0;
    let currentBuffer = this.buffer[this.currentBufferIndex];
    let backBuffer = this.buffer[backBufferIndex];

    //count the neighbors of a cell

    function countNeighbors(x, y, options={border: 'zero'}) {
      let neighborCount = 0;

      if (options.border === 'wrap') {
        let north = y - 1;
        let south = y + 1;
        let east = x + 1;
        let west = x - 1;

        //wrap around the edges

        if (north < 0) { 
          north  = this.height - 1;
        }

        if (south === this.height) {
          south = 0;
        }

        if (west < 0) {
          west = this.width -1;
        }

        if (east === this.width) {
          east = 0;
        }

        neighborCount = 
        currentBuffer[north][west] + //diagnal
        currentBuffer[north][x] + //directly north
        currentBuffer[north][east] +
        currentBuffer[y][west] + //directly west
        currentBuffer[y][east] + //directly east
        currentBuffer[south][west] +
        currentBuffer[south][x] + //directly south
        currentBuffer[south][east];

      } else if (options.border === 'zero') {
        //treat out of bounds as zero
        for(let yOffset = -1; yOffset <= 1; yOffset++) {
          let yPos = y + yOffset;

          if (yPos < 0 || yPos === this.height) {
            //out of bounds
            continue;
          }

          for (let xOffset = -1; xOffset <= 1; xOffset++) {
            let xPos = x + xOffset;

            if (xPos < 0 || xPos === this.width){
              //out of bounds
              continue;
            }
            //dont count center element
            if (xOffset === 0 && yOffset === 0) {
              continue;
            }

            neighborCount += currentBuffer[yPos][xPos];
          }
        }

      } else {
        throw new Error('unknown border option' + options.border);
      }

      return neighborCount;
    }
    //Loop through and decide if the next gen is alive
    //for each cell processed

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {

        let neighborCount = (countNeighbors.bind(this))(x, y);

        let thisCell = currentBuffer[y][x];

        if (thisCell === 1) {
          // We're alive. Let's check if we're dying.
          if (neighborCount < 2 || neighborCount > 3) {
            // Wake up. Time to die.
            backBuffer[y][x] = 0;
          } else {
            // We're still alive!
            backBuffer[y][x] = 1;
          }
        } else {
          // We're dead. Let's see if we come to life.
          if (neighborCount === 3) {
            // A rebirth!
            backBuffer[y][x] = 1;
          } else {
            // We're still dead
            backBuffer[y][x] = 0;
          }
        }
      }
    }
    this.currentBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;
  }
}

export default Life; 