let slider;
let playButton;
let isPlaying = false;

function setup() {
  frameRate(5);
  createCanvas(400, 400);

  let sliderStart = randomInt(100, 300);
  console.log(sliderStart);

  slider = createSlider(0, 399, sliderStart);
  slider.position(0, 420);
  slider.size(400);
  slider.mouseReleased(() => {
    drawCloud();
    drawLightning(slider.value());
  });

  playButton = createButton('play');
  playButton.position(0, 450);
  playButton.mousePressed(() => {
    isPlaying = !isPlaying;
  });
  
  for (let i = 0; i < 10; i++) {
    let x = randomCoordinate(400);
    let y = randomCoordinate(400);
    let intensity = randomIntensity();
    setRegion(x, y, intensity);
  }

  drawCloud();
  drawLightning(slider.value());
}

function draw() {
  let x = slider.value();

  if (isPlaying) {
    if (x >= 399) {
      slider.value(0);
    } else {
      slider.value(x + 10);
    }
    drawCloud();
    drawLightning(slider.value());  
  }
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

function drawLightning(startPosition) {
  if (startPosition < 0 || startPosition > 400) {
    console.error("Invalid start position");
    return;
  }

  let x = startPosition;
  let y = 0;
  let lightningColor = color('black');

  while (y < 399) {
    set(x, y, lightningColor);

    y += 1;
    let minAir = airGrid[x][y];
    let minX = x;

    if (x > 0 && airGrid[x-1][y] < minAir) {
      minAir = airGrid[x-1][y];
      minX = x-1;
    }
    if (x < 399 && airGrid[x+1][y] < minAir) {
      minAir = airGrid[x+1][y];
      minX = x+1;
    }

    if (x > 0 && airGrid[x][y] == airGrid[x-1][y]) {
      if (randomPercentage(50)) {
        minX = minX;
      } else {
        minX = x - 1;        
      }
    }
    if (x < 398 && airGrid[x][y] == airGrid[x+1][y]) {
      if (randomPercentage(50)) {
        minX = minX;
      } else {
        minX = x + 1;        
      }
    }

    x = minX;
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
  let result = randomInt(8, 64);
  if (randomPercentage(20)) {
    result += randomInt(8, 64);
  }
  if (randomPercentage(10)) {
    result += randomInt(8, 64);
  }
  return result;
}

function randomInt(min, max) {
  return Math.floor((Math.random() * (max - min)) + min);
}

function randomPercentage(percentage) {
  return (Math.random() * 100) < percentage;
}
