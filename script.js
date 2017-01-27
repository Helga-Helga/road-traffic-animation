function draw() {
        var canvas = document.getElementById('canvas');
        if (canvas.getContext){
          var ctx = canvas.getContext('2d');

          var lanes = 2;
          var laneHeight = 50;
          var roadHeight = lanes * laneHeight + (lanes - 1) * 4;

          canvas.setAttribute('width', 300);
          canvas.setAttribute('height', roadHeight);

          var road = new Path2D();
          road.rect(0, 0, 300, roadHeight);
          ctx.fill(road);

          for (var i = 0; i < lanes + 1; i++) {
            drawDashedPath(ctx, laneHeight + laneHeight * i + 4 * i);
          }

          function drawDashedPath(ctx, start) {
            for (var i = 0; i < 20; i++) {
              ctx.fillStyle = 'white';
              ctx.fillRect(i * 16, start, 8, 4);
            }
          }
        }
      }
