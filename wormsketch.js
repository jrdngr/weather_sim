function setup() {
  frameRate(60);
  createCanvas(400, 400);
}

let delay = 0;

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
  
  delay+= 1;
  if (delay > 75) {
    delay = 0;
    fill(`#00000003`);
    square(0, 0, 400);
  }
}
