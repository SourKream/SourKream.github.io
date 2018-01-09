
// Parameters
var num_circ, resolution_factor, speed_k;
var radius_factor, trace_all_paths, outer;

// Vars
var c = [];
var start = false;
var finish = false;
var dir = 1;

// IO
var num_circ_input, speed_k_input, radius_factor_input, resolution_factor_input;
var trace_all_paths_input, outer_input;
var run_button;

function setup(){
  
  var canvas = createCanvas(600, 600);
  canvas.parent('spiro_holder');
  setupIO();
  run_cycle();
}

function run_cycle(){
  getParamValues();
  start = true;
  var r = 100;
  var speed = 1/speed_k;
  dir = 1;
  if(!outer){
    dir = -1;
    r *= 2;
  }
  c = [];
  for (var i=0; i<num_circ; i++){
    c[i] = new Circle(r, speed);
    r = r/radius_factor;
    speed *= speed_k;
  }
}

function draw(){

  if(start){
    if(!finish){

      background(255);
      strokeWeight(2);
      noFill();
      translate(width/2, height/2);

      stroke(0,100);
      c[0].drawCircle();
      for (var i=1; i<num_circ; i++){
        c[i].updatePosition(c[i-1]);

        stroke(0,100);
        c[i].drawCircle();

        if(trace_all_paths) {
          stroke(255*i/num_circ,150 - 150*i/num_circ,255-255*i/num_circ);
          c[i].drawPath();
        }
      }

      if(!trace_all_paths) {
        stroke(255,0,0);
        c[num_circ-1].drawPath();
      }

      if(c[1].angle > 3*PI/2){
        finish = true;
      }
    } else {
      background(255);
      translate(width/2, height/2);
      if(trace_all_paths) {
        for (var i=1; i<num_circ; i++){
          stroke(255*i/num_circ,150 - 150*i/num_circ,255-255*i/num_circ);
          c[i].drawPath();
        }
      } else {
        stroke(255,0,0);
        c[num_circ-1].drawPath();
      }
      start = false;
      finish = false;
    } 
  }
}

function Circle(radius, speed) {

  this.r = radius;
  this.x = 0;
  this.y = 0;
  this.angle = -PI/2;
  this.speed = speed * resolution_factor;
  this.center_path = []

  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
  }

  this.drawCircle = function() {
    ellipse(this.x, this.y, 2*this.r, 2*this.r);
  }

  this.drawPath = function() {
    beginShape();
    for (var i=0; i<this.center_path.length; i++){
      vertex(this.center_path[i].x, this.center_path[i].y);
    }
    endShape();
  }

  this.updatePosition = function(c) {
      this.x = c.x + (c.r + dir*this.r)*cos(this.angle);
      this.y = c.y + (c.r + dir*this.r)*sin(this.angle);
      this.angle += this.speed;
      this.center_path.push(createVector(this.x, this.y));
  }
}

function setupIO() {

  var basePosition = 800;

  var desc = createElement('h3', 'Number Of Circles');
  desc.position(230, basePosition);
  num_circ_input = createInput();
  num_circ_input.position(420, basePosition);

  var desc = createElement('h3', 'Turn Factor');
  desc.position(230, basePosition + 30);
  speed_k_input = createInput();
  speed_k_input.position(420, basePosition + 30);

  var desc = createElement('h3', 'Radius Decay Factor');
  desc.position(230, basePosition + 60);
  radius_factor_input = createInput();
  radius_factor_input.position(420, basePosition + 60);

  var desc = createElement('h3', 'Resolution Factor');
  desc.position(700, basePosition);
  resolution_factor_input = createInput();
  resolution_factor_input.position(880,basePosition);

  var desc = createElement('h3', 'Trace All Paths?');
  desc.position(700, basePosition + 30);
  trace_all_paths_input = createInput();
  trace_all_paths_input.position(880, basePosition + 30);

  var desc = createElement('h3', 'Put Circles Outside?');
  desc.position(700, basePosition + 60);
  outer_input = createInput();
  outer_input.position(880, basePosition + 60);

  run_button = createButton('RUN');
  run_button.position(620, basePosition + 120);
  run_button.mousePressed(run_cycle);

  setDefaultParamValues();
}

function setDefaultParamValues(){
  num_circ_input.value(6);
  resolution_factor_input.value(0.01);
  speed_k_input.value(-3);
  radius_factor_input.value(3);
  trace_all_paths_input.value(false);
  outer_input.value(false);
}

function getParamValues(){
  num_circ = num_circ_input.value();
  resolution_factor = resolution_factor_input.value();
  speed_k = speed_k_input.value();
  radius_factor = radius_factor_input.value();
  trace_all_paths = (trace_all_paths_input.value() == 'true');
  outer = (outer_input.value() == 'true');
}
