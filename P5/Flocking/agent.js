class Agent {

	constructor() {
		this.size = 5;
		this.perceptionRadius = 100;
		this.minSeparation = 100;
		this.boundarySeparation = 60;
		this.maxAccel = 0.4;
		this.minVel = 4;
		this.maxVel = 8;

		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.mult(random(this.minVel, this.maxVel));
		this.acceleration = createVector(0, 0);

	}

	boundary() {
		if (this.position.x >= width) {
			this.position.x -= width;
		} else if (this.position.x <= 0) {
			this.position.x += width;
		}
		if (this.position.y >= height) {
			this.position.y -= height;
		} else if (this.position.y <= 0) {
			this.position.y += height;
		}
	}

	align(flock) {
		let averageHeading = createVector();
		let numNeighbours = 0;
		for (let neighbour of flock) {
			if (!this.position.equals(neighbour.position)) {
				if (this.position.dist(neighbour.position) < this.perceptionRadius) {
					numNeighbours += 1;
					averageHeading.add(neighbour.velocity);
				}
			}
		}
		averageHeading.div(numNeighbours);
		averageHeading.setMag(this.maxVel);

		averageHeading.sub(this.velocity);

		return averageHeading;
	}

	cohesion(flock) {
		let averagePosition = createVector();
		let numNeighbours = 0;
		for (let neighbour of flock) {
			if (!this.position.equals(neighbour.position)) {
				if (this.position.dist(neighbour.position) < this.perceptionRadius) {
					numNeighbours += 1;
					averagePosition.add(neighbour.position);
				}
			}
		}
		averagePosition.div(numNeighbours);
		averagePosition.sub(this.position);
		averagePosition.setMag(this.maxVel);

		averagePosition.sub(this.velocity);

		return averagePosition;
	}

	separation(flock) {
		let separationVelocity = createVector();
		let numNeighbours = 0;
		for (let neighbour of flock) {
			if (!this.position.equals(neighbour.position)) {
				if (this.position.dist(neighbour.position) < this.minSeparation) {
					let tempVel = this.position.copy();
					tempVel.sub(neighbour.position);
					let tempMag = 1.0 / tempVel.mag();
					tempVel.setMag(tempMag);

					separationVelocity.add(tempVel);
					numNeighbours += 1;
				}
			}
		}
		separationVelocity.div(numNeighbours);
		separationVelocity.setMag(this.maxVel);

		separationVelocity.sub(this.velocity);

		return separationVelocity;
	}

	minSpeed() {
		let heading = createVector();
		if (this.velocity.mag() < this.minVel) {
			heading = this.velocity.copy();
			heading.setMag(this.maxVel);
			heading.sub(this.velocity);
		}
		return heading;
	}

	avoidBoundary() {
		let desiredVel = createVector();
		if (this.position.x >= width - this.boundarySeparation && this.velocity.x > 0) {
			desiredVel = createVector(-this.velocity.x, this.velocity.y);
			desiredVel.setMag(this.maxVel);
			desiredVel.sub(this.velocity);
		} else if (this.position.x <= this.boundarySeparation && this.velocity.x < 0) {
			desiredVel = createVector(-this.velocity.x, this.velocity.y);
			desiredVel.setMag(this.maxVel);
			desiredVel.sub(this.velocity);
		}
		if (this.position.y >= height - this.boundarySeparation && this.velocity.y > 0) {
			desiredVel = createVector(this.velocity.x, -this.velocity.y);
			desiredVel.setMag(this.maxVel);
			desiredVel.sub(this.velocity);
		} else if (this.position.y <= this.boundarySeparation && this.velocity.y < 0) {
			desiredVel = createVector(this.velocity.x, -this.velocity.y);
			desiredVel.setMag(this.maxVel);
			desiredVel.sub(this.velocity);
		}

		return desiredVel;
	}

	flocking(flock) {
		let alignment = this.align(flock);
		let cohesion = this.cohesion(flock);
		let separation = this.separation(flock);

		alignment.mult(alignSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());

		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
		this.acceleration.add(this.minSpeed());
		this.acceleration.add(this.avoidBoundary());

		this.acceleration.limit(this.maxAccel);
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxVel);

		this.acceleration.mult(0);
		this.boundary();
	}

	show(showPR, showSR, showVV) {
		fill(0);
		stroke(0, 0, 0);
		ellipse(this.position.x, this.position.y, this.size, this.size);

		// Draw Perception Radius
		if (showPR) {		
			noFill();
			stroke(100, 0, 0);
			ellipse(this.position.x, this.position.y, 2*this.perceptionRadius, 2*this.perceptionRadius);
		}

		// Draw Separation Radius
		if (showSR) {
			noFill();
			stroke(0, 0, 100);
			ellipse(this.position.x, this.position.y, 2*this.minSeparation, 2*this.minSeparation);
		}

		// Draw Velocity Vector
		if (showVV) {
			stroke(0, 200, 0);
			if (this.velocity.mag() < this.minVel) {
				stroke(200, 0, 0);
			}
			let scale = 50;
			line(this.position.x, this.position.y, this.position.x + scale * this.velocity.x, this.position.y + scale * this.velocity.y);
		}
	}
}