
var initC = -1;
var iter = 0;
var Draw = true;
var points = [];

var distance_input, decay_input, lat_decay_input;
var default_button, reset_button, iterate_button, cool_button;

var cool_values, cool_index;

function setup(){
  
  var canvas = createCanvas(750, 600);
  canvas.parent('dc_holder');
  resetPoints();

  setupIO();
  setupCoolValues();
  defaultValues();
}

function draw(){

  if (Draw){
    background(255);
    stroke(0, 102, 153);
    strokeWeight(2);
    noFill();
  
    beginShape();
    for (var i=0; i<points.length; i++){
      vertex(points[i].x, points[i].y);
    }
    endShape();
    
    textSize(32);
    fill(0, 102, 153);
    text(iter, 650, 50);
    textSize(20);
    strokeWeight(1);
    text("Distance", 50, 500);
    text("Decay", 50, 530);
    text("Lat Decay", 50, 560);

    Draw = false;
  }
}

function keyPressed() {
  if (key == 'I')
      iterate();
  if (key == 'R')
    resetPoints();  
  if (key == 'D')
    defaultValues();
}

function defaultValues() {
  distance_input.value(1.0)
  decay_input.value(1.0)
  lat_decay_input.value(1.0)
}

function resetPoints() { 
  initC = -1;
  iter = 0;
  points = [];
  points.push(createVector(200, 320));
  points.push(createVector(630, 320));  
  Draw = true;
}

function iterate() {
  if (iter == 18)
    return;

  iter += 1;
  Draw = true;
  
  var newPoints = [];  
  var c = initC;
  
  // Play With This
  // initC *= 1;
  // initC *= 0.99;
  initC *= decay_input.value();

  // Play With This
  // var d = 1;  
  // var d = 0.5;  
  var d = distance_input.value();

  for (var i=1; i<points.length; i++){    
    var x1 = points[i-1].x;
    var y1 = points[i-1].y;
    var x2 = points[i].x;
    var y2 = points[i].y;
    
    // Play With This
    // c *= -0.9999;
    // c *= -1;
    c *= -1 * lat_decay_input.value();
    
    newPoints.push(points[i-1]);
    newPoints.push(createVector((x1+x2)/2 + d*c*(y2-y1)/2, (y1+y2)/2 - d*c*(x2-x1)/2));
  }
  newPoints.push(points[points.length-1]);
  
  points = newPoints;
}

function setupIO() {
  distance_input = createInput();
  distance_input.position(420, 645);
  decay_input = createInput();
  decay_input.position(420, 675);
  lat_decay_input = createInput();
  lat_decay_input.position(420, 705);

  default_button = createButton('Default');
  default_button.position(600, 675);
  default_button.mousePressed(defaultValues);
  reset_button = createButton('Reset');
  reset_button.position(630 + default_button.width, 675);
  reset_button.mousePressed(resetPoints);
  iterate_button = createButton('Iterate');
  iterate_button.position(reset_button.x + reset_button.width + 30, 675);
  iterate_button.mousePressed(iterate);
  cool_button = createButton('Cool Patterns');
  cool_button.position(iterate_button.x + iterate_button.width + 30, 675);
  cool_button.mousePressed(setCoolValue);  
}

function setupCoolValues(){
  cool_values = [];
  cool_index = -1;
  cool_values.push([1,0.99,1]);
  cool_values.push([1,1,0.999]);
  cool_values.push([0.65,1.05,1]);
  cool_values.push([1.05,0.95,1]);
}

function setCoolValue() {
  cool_index += 1;
  if (cool_index == cool_values.length)
    cool_index = 0;

  distance_input.value(cool_values[cool_index][0])
  decay_input.value(cool_values[cool_index][1])
  lat_decay_input.value(cool_values[cool_index][2])  
}