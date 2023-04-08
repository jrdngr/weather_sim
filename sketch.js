function setup() {
  frameRate(60);
  createCanvas(400, 400);

  for (let i = 0; i < 10; i++) {
    let x = randomCoordinate(400);
    let y = randomCoordinate(400);
    let intensity = randomIntensity();
    setRegion(x, y, intensity);
  }

  drawCloud();
}

function draw() {

}

const cloudRadius = 200;
let canPlace = true;
let airGrid = Array(400).fill(null).map(()=>Array(400).fill(0));

function setRegion(centerX, centerY, intensity) {
  intensity = Math.min(255, intensity);

  // Populate cloud
  for (let x = 0; x < 400; x++) {
    for (let y = 0; y < 400; y++) {
      let distance = Math.floor(Math.sqrt((centerX - x)**2 + (centerY - y)**2));
      if (distance > cloudRadius) {
        continue;
      } else if (distance == 0) {
        addToCell(x, y, intensity);
      } else {
        let distanceRatio = 1 - (distance / cloudRadius);
        let modifiedIntensity = Math.floor(intensity * distanceRatio);
        addToCell(x, y, modifiedIntensity);
      }
    }
  }
}

function drawCloud() {
  // Draw cloud
  for (let i = 0; i < 400; i++) {
    for (let j = 0; j < 400; j++) {
      let cloudColor = color("#0000FF");
      cloudColor.setAlpha(airGrid[i][j]);  
      set(i, j, cloudColor);
    }
  }
  updatePixels();
}

function addToCell(i, j, value) {
  if (i < 0 || i >= 400 || j < 0 || j >= 400) {
    return;
  }
  airGrid[i][j] = Math.min(255, airGrid[i][j] + value);
}

function randomCoordinate(max) {
  let num = randomInt(0, 255);
  let ratio = num / 255;
  return ratio * max;
}

function randomIntensity() {
  return randomInt(8, 64);
}

function randomInt(min, max) {
  return Math.floor((Math.random() * max) + min);
}
