const SCALE = 2;

const DELIMITER_HEIGHT = 10 / SCALE;
const LANE_HEIGHT = 200 / SCALE;
const CAR_HEIGHT = LANE_HEIGHT / 2;
const CAR_WIDTH = CAR_HEIGHT * 2;
const CAR_SPAWN_POINT = -CAR_WIDTH;
const DASH_WIDTH = CAR_HEIGHT;
const DASH_SPACE_WIDTH = DASH_WIDTH * 2;

let time = 0;

function draw(lanes = 2) {
  const canvas = document.getElementById('canvas');
  const roadHeight = lanes * LANE_HEIGHT + (lanes - 1) * DELIMITER_HEIGHT;
  init(canvas, roadHeight);
  redraw(canvas.getContext('2d'), roadHeight, canvas.width, lanes, []);
}

function init(canvas, roadHeight) {
  canvas.setAttribute('height', roadHeight);
  canvas.setAttribute('width', window.innerWidth - 20);
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

function drawRoad(ctx, roadHeight, roadWidth, lanes) {
  const road = new Path2D();
  road.rect(0, 0, roadWidth, roadHeight);
  ctx.fillStyle = 'gray';
  ctx.fill(road);

  for (let i = 0; i < lanes; i++) {
    drawDashedPath(ctx, LANE_HEIGHT + (LANE_HEIGHT + DELIMITER_HEIGHT) * i, roadWidth);
  }
}

function redraw(ctx, roadHeight, roadWidth, lanes, cars) {
  drawRoad(ctx, roadHeight, roadWidth, lanes);
  const freeLanes = getFreeLanes(cars, lanes);
  if (Math.random() < 1 / 50 && freeLanes.length > 0) {
    spawnCar(cars, freeLanes, CAR_SPAWN_POINT, Math.random() * 10 + 1, getImageFileName());
  }
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
    currentCar.draw(ctx);
  });

  time++;
  const onNextFrame = redraw.bind(this, ctx, roadHeight, roadWidth, lanes, cars);
  setTimeout(window.requestAnimationFrame.bind(window, onNextFrame), 1000 / 25);
}

function drawDashedPath(ctx, start, width) {
  ctx.fillStyle = 'white';
  for (let i = 0; i < width / (DASH_WIDTH + DASH_SPACE_WIDTH); i++) {
    ctx.fillRect(i * (DASH_WIDTH + DASH_SPACE_WIDTH), start, DASH_WIDTH, DELIMITER_HEIGHT);
  }
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

  draw(ctx) {
    if (!this.imageLoaded) {
      return;
    }
    const y = LANE_HEIGHT / 3 + LANE_HEIGHT * this.lane + DELIMITER_HEIGHT * this.lane;
    ctx.drawImage(this.image, this.x, y, CAR_WIDTH, CAR_HEIGHT);
  }

  move(dx) {
    this.x += dx;
  }
}
