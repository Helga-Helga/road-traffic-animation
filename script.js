const DELIMITER_HEIGHT = 4;
const LANE_HEIGHT = 50;

function draw() {
  const canvas = document.getElementById('canvas');
  if(!canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const LANES = 2;
  const roadHeight = LANES * LANE_HEIGHT + (LANES - 1) * DELIMITER_HEIGHT;

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
    ctx.fillRect(i * 16, start, 8, DELIMITER_HEIGHT);
  }
}

function drawCar(ctx, x, y) {
 var car = new Image();
 car.onload = function() {
   ctx.drawImage(car, x, y, 40, 20);
 };
 car.src = 'pictures/car1.png';
}
