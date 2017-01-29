const SCALE = 2;

const DELIMITER_HEIGHT = 10 / SCALE;
const LANE_HEIGHT = 200 / SCALE;
const DASH_WIDTH = 40 / SCALE;
const DASH_SPACE_WIDTH = 80 / SCALE;
const CAR_HEIGHT = LANE_HEIGHT / 2;

let time = 0;

function draw(lanes = 2) {
  const canvas = document.getElementById('canvas');
  const roadHeight = lanes * LANE_HEIGHT + (lanes - 1) * DELIMITER_HEIGHT;
  init(canvas, roadHeight);
  redraw(canvas.getContext('2d'), roadHeight, lanes);
}

function init(canvas, roadHeight) {
  canvas.setAttribute('height', roadHeight);
  canvas.setAttribute('width', window.innerWidth - 20);
}

function redraw(ctx, roadHeight, lanes) {
  const road = new Path2D();
  road.rect(0, 0, canvas.width, roadHeight);
  ctx.fillStyle = 'gray';
  ctx.fill(road);

  for (let i = 0; i < lanes + 1; i++) {
    drawDashedPath(ctx, LANE_HEIGHT + LANE_HEIGHT * i + DELIMITER_HEIGHT * i, canvas.width);
  }

  for (let i = 0; i < lanes + 1; i++) {
    const vx = 1;
    const car = new Car(time * vx, i, `pictures/car${Math.round(Math.random() * 8 + 1)}.png`);
    car.draw(ctx);
  }
  time++;
  setTimeout(window.requestAnimationFrame.bind(window, redraw.bind(this, ctx, roadHeight, 2)), 20);
}

function drawDashedPath(ctx, start, width) {
  ctx.fillStyle = 'white';
  for (let i = 0; i < width / (DASH_WIDTH + DASH_SPACE_WIDTH); i++) {
    ctx.fillRect(i * (DASH_WIDTH + DASH_SPACE_WIDTH), start, DASH_WIDTH, DELIMITER_HEIGHT);
  }
}

class Car {
  constructor(x, lane, imageFileName) {
    this.x = x;
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

  move(newX) {
    this.x = newX;
  }
}
