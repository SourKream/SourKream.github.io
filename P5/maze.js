
let gridSize = 75;
let cellSize = 8;

var grid = new Array(gridSize);
var search;
var prev = 0;
var GlobalGoal = new Element(gridSize -2, gridSize -2, 0);

function setup(){
  var canvas = createCanvas(600, 600);
  canvas.parent('maze_holder');
  
  // Random Initilise Maze
  for (var i=0; i<gridSize; i++)
    grid[i] = new Array(gridSize);
  randomInitialise();

  grid[GlobalGoal.x][GlobalGoal.y] = 10;
  search = new Search(grid,2,2, GlobalGoal);
}

function draw() {
  background(220);
  drawMaze();
  prev = search.iterate(prev);
}

function reset() {
  search = 0;
  for (var i=0; i<gridSize; i++){
    for (var j=0; j<gridSize; j++){
      if (grid[i][j] != 1)
        grid[i][j] = 0;
    }
  }
  grid[GlobalGoal.x][GlobalGoal.y] = 10;
  search = new Search(grid,2,2, GlobalGoal);
}

function drawMaze() {
  // Draw Maze  
  strokeWeight(1);
  stroke(192,192,192);
  for (var i=0; i<gridSize; i++){
    for (var j=0; j<gridSize; j++){
      if (grid[i][j] == 1)
        fill(0);
      else if (grid[i][j] == 0)
        fill(255);
      else if (grid[i][j] == 5)
        fill(255,0,0);
      else if (grid[i][j] == 3)
        fill(0,0,255);
      else if (grid[i][j] == 10)
        fill(0,255,0);
      rect(i*cellSize, j*cellSize, cellSize, cellSize);
    }
  } 
}

function getNeighbours(element){
  var neighbours = [];
  var i = element.x;
  var j = element.y;
  if(i+1 < gridSize)
    neighbours.push(new Element(i+1, j, element));
  if(j+1 < gridSize)
    neighbours.push(new Element(i, j+1, element));
  if(i-1 >= 0)
    neighbours.push(new Element(i-1, j, element));
  if(j-1 >= 0)
    neighbours.push(new Element(i, j-1, element));
  return neighbours
}

function keyPressed() {
  print(key)
  if (key == 'P'){
  }
  else if (key == 'R'){
    reset();
  }
  else if (key == 'T'){
  }
  else if (key == 'W'){
  }
  else if (key == 'C'){
  }
  else if (key == '1'){
  }
}

// function mouseDragged() {
//   if ((mouseX > 0) && (mouseX < gridSize*cellSize))
//     if ((mouseY > 0) && (mouseY < gridSize*cellSize)){
//       if (keyIsPressed == true && keyCode == SHIFT)
//           grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)] = false; 
//       else
//         grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)] = true;       
//     }
// }

// function mouseClicked() {
//   if ((mouseX > 0) && (mouseX < gridSize*cellSize))
//     if ((mouseY > 0) && (mouseY < gridSize*cellSize))
//       grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)] = !grid[floor(mouseX/cellSize)][floor(mouseY/cellSize)]; 
// }

// function cleanGrid(){
//   for (var i=0; i<gridSize; i++)
//     for (var j=0; j<gridSize; j++)
//         grid[i][j] = false;
// }

function randomInitialise() {
  for (var i=0; i<gridSize; i++){
    for (var j=0; j<gridSize; j++){
      if (random(100) <= 30)
        grid[i][j] = 1;
      else
        grid[i][j] = 0;
    }
  }
}


function Search(grid, i, j, goal){

  this.grid = grid;
  this.goal = goal;
  this.startElement = new Element(i, j, 0);
  // this.searchFront = new DFS(this.startElement);
  // this.searchFront = new BFS(this.startElement);
  this.searchFront = new InformedSearch(this.startElement, this.goal);

  this.iterate = function(previous) {
    if (previous != 0)
      this.colourPathToElement(previous, 5);

    curr = this.searchFront.getElement();
    i = curr.x;
    j = curr.y;
  
    if (this.grid[i][j] == 10){
      print("DONE")
      this.colourPathToElement(previous, 5);
      this.colourPathToElement(curr, 3);
      noLoop();
      return;
    } 

    if(this.grid[i][j] != 0)
      return;

    this.grid[i][j] = 5;
    this.colourPathToElement(curr, 3);
    neighbours = getNeighbours(curr);
    for (var k=0; k<neighbours.length; k++){
      if (this.grid[neighbours[k].x][neighbours[k].y] == 0 || this.grid[neighbours[k].x][neighbours[k].y] == 10){
        this.searchFront.addElement(neighbours[k]);
      }
    }

    return curr;
  }

  this.colourPathToElement = function(element, colour) {
    var next_element = element;
    while(next_element != 0 && next_element != undefined){
      this.grid[next_element.x][next_element.y] = colour;
      next_element = next_element.previous;
    }
  }

}

function Element(i, j, prev){

  this.x = i;
  this.y = j;
  this.previous = prev;

}

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

function distElement(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function InformedSearch(element, goal){

  this.goal = goal;
  this.store = new PriorityQueue({ comparator: function(a, b) { 
    return distElement(a, GlobalGoal) - distElement(b, GlobalGoal); 
  }});
  this.store.queue(element);

  this.getElement = function(){
    return this.store.dequeue();
  }

  this.addElement = function(element){
    this.store.queue(element);
  }

}