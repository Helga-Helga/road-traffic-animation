const DELIMITER_HEIGHT = 10;
const LANE_HEIGHT = 200;
const DASH_WIDTH = 40;
const DASH_SPACE_WIDTH = 80;

function draw(lanes=2) {
  const canvas = document.getElementById('canvas');
  if (!canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const roadHeight = lanes * LANE_HEIGHT + (lanes - 1) * DELIMITER_HEIGHT;

  canvas.setAttribute('height', roadHeight);
  canvas.setAttribute('width', window.innerWidth - 20);

  const road = new Path2D();
  road.rect(0, 0, canvas.width, roadHeight);
  ctx.fillStyle = 'gray';
  ctx.fill(road);

  for (let i = 0; i < lanes + 1; i++) {
    drawDashedPath(ctx, LANE_HEIGHT + LANE_HEIGHT * i + DELIMITER_HEIGHT * i, canvas.width);
  }

  for (let i = 0; i < lanes + 1; i++) {
    const car = new Car(0, i, `pictures/car${Math.round(Math.random() * 8 + 1)}.png`);
    car.draw(ctx);
  }
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
  }

  draw(ctx) {
    this.image.onload = () => {
      ctx.drawImage(this.image, this.x, LANE_HEIGHT / 3 + LANE_HEIGHT * this.lane + DELIMITER_HEIGHT * this.lane, 200, 100);
    };
  }
}
