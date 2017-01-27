function draw() {
  var canvas = document.getElementById('canvas');
  if(!canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const lanes = 2;
  const laneHeight = 50;
  const roadHeight = lanes * laneHeight + (lanes - 1) * 4;

  canvas.setAttribute('width', 300);
  canvas.setAttribute('height', roadHeight);

  const road = new Path2D();
  road.rect(0, 0, 300, roadHeight);
  ctx.fill(road);

  for (let i = 0; i < lanes + 1; i++) {
    drawDashedPath(ctx, laneHeight + laneHeight * i + 4 * i);
  }

  function drawDashedPath(ctx, start) {
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = 'white';
      ctx.fillRect(i * 16, start, 8, 4);
    }
  }
}
