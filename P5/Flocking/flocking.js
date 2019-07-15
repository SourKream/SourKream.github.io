let width = 2500;
let height = 1000;

let numAgents = 120;
var flock = [];

let alignSlider, cohesionSlider, separationSlider;
let showPR = false;
let showSR = false;
let showVV = false;

function setup(){
  var canvas = createCanvas(width, height);
  canvas.parent('flock_div');
  
  alignSlider = createSlider(0, 5, 1, 0.1)
  cohesionSlider = createSlider(0, 5, 1, 0.1)
  separationSlider = createSlider(0, 5, 1, 0.1)

  alignSlider.position(220, 1095);
  cohesionSlider.position(220, 1135);
  separationSlider.position(220, 1175);
  textSize(32);

  showPRCheckbox = createCheckbox('Show Perception Radius', showPR);
  showPRCheckbox.position(40, 970);
  showPRCheckbox.changed(() => {showPR = !showPR;})

  showSRCheckbox = createCheckbox('Show Separation Radius', showSR);
  showSRCheckbox.position(40, 1010);
  showSRCheckbox.changed(() => {showSR = !showSR;})

  showVVCheckbox = createCheckbox('Show Velocity Vector', showVV);
  showVVCheckbox.position(40, 1050);
  showVVCheckbox.changed(() => {showVV = !showVV;})

  for (let i=0; i<numAgents; i++) {
  	flock.push(new Agent());
  }	
}

function draw() {
  background(245);

  for (let agent of flock) {
    agent.flocking(flock);
  }

  for (let agent of flock) {
	  agent.update();
	  agent.show(showPR, showSR, showVV);
  }

  fill(0, 102, 153);
  text('Alignment', 10, 900);
  text('Cohesion', 10, 940);
  text('Separation', 10, 980);
}
