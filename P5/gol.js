
let gridSize = 75;
let cellSize = 8;

var grid = new Array(gridSize);
var pause = false;
var wrap = true;

var FR = 20;

function setup(){
  var canvas = createCanvas(600, 600);
  canvas.parent('gol_holder');
  
  // Random Initilise Current Generation
  for (var i=0; i<gridSize; i++)
    grid[i] = new Array(gridSize);
  randomInitialise();  
}

function draw() {
  background(220);
  
  if (pause)
    frameRate(20);
  else
    frameRate(FR);
  
  // Draw Current Generation
  strokeWeight(1);
  if (pause)
    stroke(255,102,102);
  else
    stroke(192,192,192);
  for (var i=0; i<gridSize; i++){
    for (var j=0; j<gridSize; j++){
      if (grid[i][j])
        fill(0);
      else
        fill(255);
      rect(i*cellSize, j*cellSize, cellSize, cellSize);
    }
  }
  
  // Draw Boundary
  strokeWeight(2);
  noFill();
  if (wrap)
    stroke(0,255,0);
  else
    stroke(255,0,0);  
  rect(0, 0, cellSize*gridSize, cellSize*gridSize);
  
  
  if (!pause){
    
    // Find Next Generation
    var nextGrid = new Array(gridSize);
    for (var i=0; i<gridSize; i++){
      nextGrid[i] = new Array(gridSize);
      for (var j=0; j<gridSize; j++){
  
         // Neighbours of a cell
        var n;
        if (wrap)
          n = numNeighWrap(i, j);
        else
          n = numNeigh(i,j);
          
        // GOL Rules  
        if (grid[i][j]){
          if (n < 2)
            nextGrid[i][j] = false;
          else if (n > 3)
            nextGrid[i][j] = false;
          else
            nextGrid[i][j] = true;
        } else {
          if (n == 3)
            nextGrid[i][j] = true;
          else
            nextGrid[i][j] = false;
        }
      }
    }

    grid = nextGrid;    
  }
}

function keyPressed() {
  print(key)
  if (key == 'P')
    pause = !pause;
  else if (key == 'F'){
    if (FR < 60)
      FR += 1;
  }
  else if (key == 'S'){
    if (FR > 1)
      FR -= 1;
  }
  else if (key == 'R')
    FR = 20;
  else if (key == 'T')
    randomInitialise();
  else if (key == 'W')
    wrap = !wrap;
  else if (key == 'C')
    cleanGrid();
  else if (key == '1')
    loadGosperGun(floor(mouseX/cellSize),floor(mouseY/cellSize));
  else if (key == '2')
    loadPentadecathlon(floor(mouseX/cellSize),floor(mouseY/cellSize));
}

function mouseDragged() {
  if ((mouseX > 0) && (mouseX < gridSize*cellSize))
    if ((mouseY > 0) && (mouseY < gridSize*cellSize)){
      if (keyIsPressed == true && keyCode == SHIFT)
          grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)] = false; 
      else
        grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)] = true;       
    }
}

function mouseClicked() {
  if ((mouseX > 0) && (mouseX < gridSize*cellSize))
    if ((mouseY > 0) && (mouseY < gridSize*cellSize))
      grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)] = !grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)]; 
}

function numNeigh(i, j){
  var c = 0;
  
  if (i-1>=0){
    if (grid[i-1][j])
      c += 1;
    
    if (j-1>=0)
      if (grid[i-1][j-1])
        c += 1;

    if (j+1<gridSize)
      if (grid[i-1][j+1])
        c += 1;
  }
 
  if (i+1<gridSize){
    if (grid[i+1][j])
      c += 1;
    
    if (j-1>=0)
      if (grid[i+1][j-1])
        c += 1;

    if (j+1<gridSize)
      if (grid[i+1][j+1])
        c += 1;
  }

  if (j-1>=0)
    if (grid[i][j-1])
      c += 1;

  if (j+1<gridSize)
    if (grid[i][j+1])
      c += 1;

   return c;
}

function numNeighWrap(i, j){
  var c = 0;
  
  if (grid[(i-1+gridSize)%gridSize][j])
    c += 1;
  if (grid[(i-1+gridSize)%gridSize][(j-1+gridSize)%gridSize])
    c += 1;
  if (grid[(i-1+gridSize)%gridSize][(j+1)%gridSize])
    c += 1;
  if (grid[(i+1)%gridSize][j])
    c += 1;
  if (grid[(i+1)%gridSize][(j-1+gridSize)%gridSize])
    c += 1;
  if (grid[(i+1)%gridSize][(j+1)%gridSize])
    c += 1;
  if (grid[i][(j-1+gridSize)%gridSize])
    c += 1;
  if (grid[i][(j+1)%gridSize])
    c += 1;

   return c;
}

function cleanGrid(){
  for (var i=0; i<gridSize; i++)
    for (var j=0; j<gridSize; j++)
        grid[i][j] = false;
}

function loadGosperGun(i, j){
  
  if (i+36 > gridSize - 1)
    return;
  if (j+9 > gridSize - 1)
    return;
  
  grid[i+1][j+5] = true;
  grid[i+1][j+6] = true;
  grid[i+2][j+5] = true;
  grid[i+2][j+6] = true;
  
  grid[i+11][j+5] = true;
  grid[i+11][j+6] = true;
  grid[i+11][j+7] = true;
  grid[i+12][j+4] = true;
  grid[i+12][j+8] = true;
  grid[i+13][j+3] = true;
  grid[i+13][j+9] = true;
  grid[i+14][j+3] = true;
  grid[i+14][j+9] = true;
  grid[i+15][j+6] = true;
  grid[i+16][j+4] = true;
  grid[i+16][j+8] = true;
  grid[i+17][j+7] = true;
  grid[i+17][j+6] = true;
  grid[i+17][j+5] = true;
  grid[i+18][j+6] = true;
  
  grid[i+21][j+5] = true;
  grid[i+21][j+4] = true;
  grid[i+21][j+3] = true;
  grid[i+22][j+5] = true;
  grid[i+22][j+4] = true;
  grid[i+22][j+3] = true;
  grid[i+23][j+2] = true;
  grid[i+23][j+6] = true;
  grid[i+25][j+1] = true;
  grid[i+25][j+2] = true;
  grid[i+25][j+6] = true;
  grid[i+25][j+7] = true;
  
  grid[i+35][j+3] = true;
  grid[i+35][j+4] = true;
  grid[i+36][j+3] = true;
  grid[i+36][j+4] = true;
}

function loadPentadecathlon(i, j){

  if (i+2 > gridSize - 1)
    return;
  if (j+9 > gridSize - 1)
    return;

  grid[i+1][j] = true;
  grid[i+1][j+1] = true;
  grid[i][j+2] = true;
  grid[i+2][j+2] = true;
  grid[i+1][j+3] = true;
  grid[i+1][j+4] = true;
  grid[i+1][j+5] = true;
  grid[i+1][j+6] = true;
  grid[i][j+7] = true;
  grid[i+2][j+7] = true;
  grid[i+1][j+8] = true;
  grid[i+1][j+9] = true;
  grid[i+1][j+1] = true;
}

function randomInitialise() {
  for (var i=0; i<gridSize; i++){
    for (var j=0; j<gridSize; j++){
      if (random(100) <= 12)
        grid[i][j] = true;
      else
        grid[i][j] = false;
    }
  }
}