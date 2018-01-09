let width = 700;
let height = 480;

let size = 20;
let num = 16;
let border = 6;

let time = 0;

function setup() {
	createCanvas(width, height, WEBGL);
	ortho();
}

function draw() {
	background(255);
	fill(150);
	rotateX(-asin(tan(PI/6)));
	rotateY(PI/4);
	orbitControl();
	
	for (var z = 0; z < num; z++) {
		for (var x = 0; x < num; x++) {
			push();
			var r = dist((x-num/2)*size + size/2, (z-num/2)*size + size/2,0,0);
			var h = floor(140 + 80*cos(0.027*r - time));
			translate((x-num/2)*size + size/2, 0, (z-num/2)*size + size/2);
			normalMaterial();
			box(size-border, h, size-border);
			pop();
		}
	}

	time += 0.075;

}