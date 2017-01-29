const SCALE = 2;

const DELIMITER_HEIGHT = 10 / SCALE;
const LANE_HEIGHT = 200 / SCALE;
const CAR_HEIGHT = LANE_HEIGHT / 2;
const DASH_WIDTH = CAR_HEIGHT;
const DASH_SPACE_WIDTH = DASH_WIDTH * 2;

let time = 0;

function draw(lanes = 2) {
  const canvas = document.getElementById('canvas');
  const roadHeight = lanes * LANE_HEIGHT + (lanes - 1) * DELIMITER_HEIGHT;
  init(canvas, roadHeight);
  const cars = [];
  for (let i = 0; i < lanes; i++) {
    cars.push(new Car(-50, Math.random() * 10 + 1, i, `pictures/car${Math.round(Math.random() * 8 + 1)}.png`));
  }
  redraw(canvas.getContext('2d'), roadHeight, canvas.width, lanes, cars);
}

function init(canvas, roadHeight) {
  canvas.setAttribute('height', roadHeight);
  canvas.setAttribute('width', window.innerWidth - 20);
}

function redraw(ctx, roadHeight, roadWidth, lanes, cars) {
  const road = new Path2D();
  road.rect(0, 0, roadWidth, roadHeight);
  ctx.fillStyle = 'gray';
  ctx.fill(road);

  for (let i = 0; i < lanes; i++) {
    drawDashedPath(ctx, LANE_HEIGHT + (LANE_HEIGHT + DELIMITER_HEIGHT) * i, roadWidth);
  }

  if (Math.random() < 1 / 50) {
    cars.push(new Car(-50, Math.random() * 10 + 1, Math.round(Math.random() * lanes), `pictures/car${Math.round(Math.random() * 8 + 1)}.png`));
  }
  cars.forEach((car, i) => {
    if (car.x > window.innerWidth - 20 - 100) {
      delete cars[i];
      return;
    }
    car.move(car.velocity);
    car.velocity += (Math.random() - 0.5) * 2;
    if (car.velocity < 0) {
      car.velocity = 0;
    }
    car.draw(ctx);
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
    ctx.drawImage(this.image, this.x, y, CAR_HEIGHT * 2, CAR_HEIGHT);
  }

  move(dx) {
    this.x += dx;
  }
}
