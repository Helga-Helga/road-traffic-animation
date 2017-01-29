const DELIMITER_HEIGHT = 10;
const LANE_HEIGHT = 200;

function draw(lanes=2) {
  const canvas = document.getElementById('canvas');
  if (!canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const roadHeight = lanes * LANE_HEIGHT + (lanes - 1) * DELIMITER_HEIGHT;

  canvas.setAttribute('width', 300);
  canvas.setAttribute('height', roadHeight);

  const road = new Path2D();
  road.rect(0, 0, 300, roadHeight);
  ctx.fill(road);

  for (let i = 0; i < LANES + 1; i++) {
    drawDashedPath(ctx, LANE_HEIGHT + LANE_HEIGHT * i + DELIMITER_HEIGHT * i);
  }

  for (let i = 0; i < LANES + 1; i++) {
    drawCar(ctx, 0, LANE_HEIGHT / 3 + LANE_HEIGHT * i + DELIMITER_HEIGHT * i);
  }
}

function drawDashedPath(ctx, start) {
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = 'white';
    ctx.fillRect(i * 40, start, 20, DELIMITER_HEIGHT);
  }
}

function drawCar(ctx, x, y) {
  const car = new Image();
  car.onload = () => {
    ctx.drawImage(car, x, y, 40, 20);
  };
  const carsImages = ["1", "2", "3", "4", "5"];
  car.src = "pictures/car" + carsImages[Math.round(Math.random() * (carsImages.length - 1))] + ".png";
}
