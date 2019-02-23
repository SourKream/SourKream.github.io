// Configurations
let canvasSize = 600;
let gridSize = 53;
let cellSize = canvasSize / gridSize;
let percentageFill = 25;

let start = new Element(2, 2, 0);
let goal = new Element(gridSize -2, gridSize -2, 0);

// Logic Variables
var maze;
var search;
var searchType = 2;

// Runtime Control Variables
var paused = false;

function setup(){
  var canvas = createCanvas(canvasSize + 1, canvasSize + 1);
  canvas.parent('maze_holder');
  
  maze = new Maze(gridSize, cellSize, percentageFill);
  maze.randomInit(percentageFill);
  maze.setGoal(goal)
  search = new Search(maze, start, goal, searchType);
}

function draw() {
  background(220);
  maze.draw();
  if (!paused && !search.completed) {
    search.iterate();
  }
}

function reset() {
  maze.clean();
  maze.setGoal(goal)
  search = new Search(maze, start, goal, searchType);
}

////////////////////////////////////////
/// Interactions with the maze

function keyPressed() {
  if (key == 'P'){
    paused = !paused;
  } else if (key == 'R'){
    reset();
  } else if (key == 'V'){
    randomGrid();
  } else if (key == 'B'){
    blankGrid();
  } else if (key == '1'){
    searchType = 0;
    reset();
  } else if (key == '2'){
    searchType = 1;
    reset();
  } else if (key == '3'){
    searchType = 2;
    reset();
  }
}

function mouseDragged() {
  if ((mouseX > 0) && (mouseX < gridSize*cellSize))
    if ((mouseY > 0) && (mouseY < gridSize*cellSize)){
      var i = floor(mouseX/cellSize);
      var j = floor(mouseY/cellSize);      
      if (keyIsPressed == true && keyCode == SHIFT)
        maze.grid[i][j] = 0; 
      else
        maze.grid[i][j] = 1;       
    }
}

function mouseClicked() {
  if ((mouseX > 0) && (mouseX < gridSize*cellSize))
    if ((mouseY > 0) && (mouseY < gridSize*cellSize)) {
      var i = floor(mouseX/cellSize);
      var j = floor(mouseY/cellSize);
      if (maze.grid[i][j] == 0) {
        maze.grid[i][j] = 1;
      } else if (maze.grid[i][j] == 1) {
        maze.grid[i][j] = 0;        
      } 
    }
}

function blankGrid(){
  maze.blank();
  reset();
}

function randomGrid(){
  maze.randomInit(percentageFill);
  reset();
}

////////////////////////////////////////
/// Class to hold the maze/grid

function Maze(gridSize, cellSize, ) {

  this.gridSize = gridSize;
  this.cellSize = cellSize;
  this.grid = new Array(this.gridSize);
  for (var i=0; i<this.gridSize; i++)
    this.grid[i] = new Array(this.gridSize);

  this.randomInit = function(percentageFill) {
    for (var i=0; i<this.gridSize; i++){
      for (var j=0; j<this.gridSize; j++){
        if (random(100) <= percentageFill)
          this.grid[i][j] = 1;
        else
          this.grid[i][j] = 0;
      }
    }
    for (var i=0; i<5; i++) {
      for (var j=0; j<5; j++) {
          this.grid[i][j] = 0;
      }
    }
  }

  this.setGoal = function(goal) {
    this.grid[goal.x][goal.y] = 10;
  }

  this.clean = function() {
    for (var i=0; i<this.gridSize; i++){
      for (var j=0; j<this.gridSize; j++){
        if (this.grid[i][j] != 1) {
          this.grid[i][j] = 0;
        }
      }
    }    
  }

  this.blank = function() {
    for (var i=0; i<this.gridSize; i++){
      for (var j=0; j<this.gridSize; j++){
          this.grid[i][j] = 0;
      }
    }    
  }

  // Draw Maze  
  this.draw = function() {
    strokeWeight(1);
    stroke(192,192,192);
    if (paused) {
      stroke(192, 0, 0);
    }
    for (var i=0; i<this.gridSize; i++){
      for (var j=0; j<this.gridSize; j++){
        if (this.grid[i][j] == 1)
          fill(0);                  // Black
        else if (this.grid[i][j] == 0)
          fill(255);                // White
        else if (this.grid[i][j] == 5)
          fill(255,0,0);            // Red
        else if (this.grid[i][j] == 3)
          fill(0,0,255);            // Blue
        else if (this.grid[i][j] == 10)
          fill(0,255,0);            // Green
        rect(i*this.cellSize, j*this.cellSize, this.cellSize, this.cellSize);
      }
    } 
  }

}

////////////////////////////////////////
/// General Maze Search Algorithm

function Search(maze, start, goal, searchType){

  this.grid = maze.grid;
  this.gridSize = maze.gridSize;
  this.goal = goal;
  this.startElement = start;
  this.previousCurrent = 0;
  this.completed = false;

  if (searchType == 0) {
    this.searchFront = new DFS(this.startElement);
  } else if (searchType == 1) {
    this.searchFront = new BFS(this.startElement);
  } else {
    this.searchFront = new InformedSearch(this.startElement, this.goal);
  }

  this.getNeighbours = function(element) {
    var neighbours = [];
    var i = element.x;
    var j = element.y;
    if(i+1 < this.gridSize)
      neighbours.push(new Element(i+1, j, element));
    if(j+1 < this.gridSize)
      neighbours.push(new Element(i, j+1, element));
    if(i-1 >= 0)
      neighbours.push(new Element(i-1, j, element));
    if(j-1 >= 0)
      neighbours.push(new Element(i, j-1, element));
    return neighbours
  }

  this.iterate = function() {
    this.colourPathToElement(this.previousCurrent, 5);

    curr = this.searchFront.getElement();
    i = curr.x;
    j = curr.y;
  
    if (this.grid[i][j] == 10){
      this.colourPathToElement(curr, 10);
      this.completed = true;
      return;
    } 

    if(this.grid[i][j] != 0)
      return;

    this.colourPathToElement(curr, 3);
    neighbours = this.getNeighbours(curr);
    for (var k=0; k<neighbours.length; k++){
      if (this.grid[neighbours[k].x][neighbours[k].y] == 0 || this.grid[neighbours[k].x][neighbours[k].y] == 10){
        this.searchFront.addElement(neighbours[k]);
      }
    }

    this.previousCurrent = curr;
  }

  this.colourPathToElement = function(element, colour) {
    var next_element = element;
    while(next_element != 0 && next_element != undefined){
      this.grid[next_element.x][next_element.y] = colour;
      next_element = next_element.previous;
    }
  }

}

/// Element class to hold this info about a node

function Element(i, j, prev){

  this.x = i;
  this.y = j;
  this.previous = prev;

}

/// Depth First Search
/// Implemented using a stack

function DFS(element){

  this.store = [];
  this.store.push(element);

  this.getElement = function(){
    return this.store.pop();
  }
  this.addElement = function(element){
    this.store.push(element);
  }

}

/// Breadth First Search
/// Implemented using a queue

function BFS(element){

  this.instore = [];
  this.outstore = [];
  this.instore.push(element);

  this.getElement = function(){
    if (this.outstore.length == 0){
      while (this.instore.length > 0){
        this.outstore.push(this.instore.pop());
      }
    }
    return this.outstore.pop();
  }

  this.addElement = function(element){
    this.instore.push(element);
  }

}

/// Informed Search
/// Implemented using a priority queue

function distElement(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function InformedSearch(element, goal){

  this.goal = goal;
  this.store = new PriorityQueue({ comparator: function(a, b) { 
    return distElement(a, goal) - distElement(b, goal); 
  }});
  this.store.queue(element);

  this.getElement = function(){
    return this.store.dequeue();
  }

  this.addElement = function(element){
    this.store.queue(element);
  }

}