const SCALE = 2;

const DELIMITER_HEIGHT = 10 / SCALE;
const LANE_HEIGHT = 200 / SCALE;
const CAR_HEIGHT = LANE_HEIGHT / 2;
const CAR_WIDTH = CAR_HEIGHT * 2;
const CAR_SPAWN_POINT = -CAR_WIDTH;
const DASH_WIDTH = CAR_HEIGHT;
const DASH_SPACE_WIDTH = DASH_WIDTH * 2;

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const canvasContext = canvas.getContext('2d');
  const lanesAmount = 2;
  const roadHeight = lanesAmount * LANE_HEIGHT + (lanesAmount - 1) * DELIMITER_HEIGHT;
  const roadWidth = window.innerWidth - 20;
  const scene = new Scene(canvas, canvasContext, lanesAmount, roadHeight, roadWidth);
  scene.draw();
};

class Scene {
  constructor(canvas, canvasContext, lanes, roadHeight, roadWidth) {
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.lanes = lanes;
    this.roadHeight = roadHeight;
    this.roadWidth = roadWidth;
  }

  draw() {
    this.initializeViewport(this.canvas);
    this.redraw([]);
  }

  initializeViewport() {
    this.canvas.setAttribute('height', this.roadHeight);
    this.canvas.setAttribute('width', this.roadWidth);
  }

  redraw(cars) {
    this.drawRoad();
    const freeLanes = getFreeLanes(cars, this.lanes);
    if (newCarNeeded(freeLanes)) {
      spawnCar(cars, freeLanes, CAR_SPAWN_POINT, Math.random() * 10 + 1, getImageFileName());
    }
    moveCars(this.canvasContext, cars);
    this.requestNextFrame(cars);
  }

  drawRoad() {
    const road = new Path2D();
    road.rect(0, 0, this.roadWidth, this.roadHeight);
    this.canvasContext.fillStyle = 'gray';
    this.canvasContext.fill(road);

    for (let i = 0; i < this.lanes; i++) {
      this.drawDashedPath(LANE_HEIGHT + (LANE_HEIGHT + DELIMITER_HEIGHT) * i);
    }
  }

  drawDashedPath(topY) {
    this.canvasContext.fillStyle = 'white';
    for (let i = 0; i < this.roadWidth / (DASH_WIDTH + DASH_SPACE_WIDTH); i++) {
      const leftX = i * (DASH_WIDTH + DASH_SPACE_WIDTH);
      this.canvasContext.fillRect(leftX, topY, DASH_WIDTH, DELIMITER_HEIGHT);
    }
  }

  requestNextFrame(cars) {
    const onNextFrame = this.redraw.bind(this, cars);
    setTimeout(window.requestAnimationFrame.bind(window, onNextFrame), 1000 / 25);
  }
}

function getFreeLanes(cars, lanes) {
  const freeLanes = [];
  for (let i = 0; i < lanes; i++) {
    freeLanes.push(i);
  }
  cars
    .filter(car => car.x < CAR_SPAWN_POINT + CAR_WIDTH * 1.5)
    .forEach((car) => {
      delete freeLanes[car.lane];
    });
  return freeLanes.filter(lane => lane !== undefined);
}

function getImageFileName() {
  const imageFileName = `pictures/car${Math.floor(Math.random() * 8 + 1)}.png`;
  return imageFileName;
}

function spawnCar(cars, freeLanes, x, velocity, imageFileName) {
  const lane = freeLanes[Math.floor(Math.random() * freeLanes.length)];
  cars.push(new Car(x, velocity, lane, imageFileName));
}

function newCarNeeded(freeLanes) {
  if (Math.random() < 1 / 50 && freeLanes.length > 0) {
    return true;
  }
  return false;
}

function moveCars(canvasContext, cars) {
  cars.forEach((currentCar, i) => {
    if (currentCar.x > window.innerWidth - 20) {
      delete cars[i];
      return;
    }
    currentCar.move(currentCar.velocity);
    currentCar.velocity += (Math.random() - 0.5) * 2;
    const isClose = cars
      .filter(car => car.lane === currentCar.lane && car !== currentCar)
      .some(car => currentCar.x < car.x && car.x <= currentCar.x + CAR_WIDTH * 1.5);
    if (currentCar.velocity < 0 || isClose) {
      currentCar.velocity = 0;
    }
    currentCar.draw(canvasContext);
  });
}

class Car {
  constructor(x, velocity, lane, imageFileName) {
    this.x = x;
    this.velocity = velocity;
    this.lane = lane;
    this.image = new Image();
    this.image.src = imageFileName;
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  draw(canvasContext) {
    if (!this.imageLoaded) {
      return;
    }
    const y = LANE_HEIGHT / 3 + LANE_HEIGHT * this.lane + DELIMITER_HEIGHT * this.lane;
    canvasContext.drawImage(this.image, this.x, y, CAR_WIDTH, CAR_HEIGHT);
  }

  move(dx) {
    this.x += dx;
  }
}
