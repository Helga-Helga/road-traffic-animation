class Scene {
  constructor(canvas, canvasContext, lanes, roadHeight, roadWidth, carsPerMinute) {
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.lanes = lanes;
    this.roadHeight = roadHeight;
    this.roadWidth = roadWidth;
    this.isStopped = false;
    this.carsPerMinute = carsPerMinute;
  }

  static increaseProgress() {
    if (!Scene.loadedItems) {
      Scene.loadedItems = 0;
    }
    Scene.loadedItems++;
    const progressBar = document.getElementById('progress');
    progressBar.innerHTML = `Loading ${Math.round((Scene.loadedItems * 100) / ITEMS_TO_LOAD)}%`;
    if (Scene.loadedItems === ITEMS_TO_LOAD) {
      progressBar.style.display = 'none';
      document.getElementById('form').style.display = 'block';
    }
  }

  stop() {
    this.isStopped = true;
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
    if (this.newCarNeeded(freeLanes)) {
      spawnCar(cars, freeLanes, CAR_SPAWN_POINT, Math.random() * 10 + 1);
    }
    this.moveCars(cars);
    if (!this.isStopped) {
      this.requestNextFrame(cars);
    }
  }

  moveCars(cars) {
    cars.forEach((currentCar, i) => {
      if (currentCar.x > window.innerWidth - 20) {
        delete cars[i];
        return;
      }
      currentCar.move(currentCar.velocity);
      currentCar.velocity += (Math.random() - 0.5) * 2;

      if (currentCar.velocity < 0) {
        currentCar.velocity = 0;
      }
      if (isClose(cars, currentCar)) {
        this.changeLane(cars, currentCar);
      }
      currentCar.draw(this.canvasContext);
    });
  }

  changeLane(cars, currentCar) {
    const canMoveUp = !isClose(cars, currentCar, currentCar.lane - 1);
    const canMoveDown = !isClose(cars, currentCar, currentCar.lane + 1);
    if (currentCar.lane === 0) {
      if (canMoveDown) {
        currentCar.changeLane(currentCar.lane + 1);
      } else {
        currentCar.velocity = 0;
      }
    } else if (currentCar.lane === this.lanes - 1) {
      if (canMoveUp) {
        currentCar.changeLane(currentCar.lane - 1);
      } else {
        currentCar.velocity = 0;
      }
    } else if (canMoveUp && canMoveDown) {
      if (Math.random() < 0.5) {
        currentCar.changeLane(currentCar.lane - 1);
      } else {
        currentCar.changeLane(currentCar.lane + 1);
      }
    } else if (canMoveUp) {
      currentCar.changeLane(currentCar.lane - 1);
    } else if (canMoveDown) {
      currentCar.changeLane(currentCar.lane + 1);
    } else {
      currentCar.velocity = 0;
    }
  }

  drawRoad() {
    this.canvasContext.fillStyle = 'gray';
    this.canvasContext.fillRect(0, this.canvas.style.top, this.roadWidth, this.roadHeight);

    for (let i = 0; i < this.lanes; i++) {
      this.drawDashedPath(LANE_HEIGHT + (LANE_HEIGHT + DELIMITER_HEIGHT) * i);
    }
  }

  drawDashedPath(topY) {
    this.canvasContext.fillStyle = 'white';
    for (let leftX = 0; leftX < this.roadWidth; leftX += DASH_WIDTH + DASH_SPACE_WIDTH) {
      this.canvasContext.fillRect(leftX, topY, DASH_WIDTH, DELIMITER_HEIGHT);
    }
  }

  requestNextFrame(cars) {
    const onNextFrame = this.redraw.bind(this, cars);
    setTimeout(window.requestAnimationFrame.bind(window, onNextFrame), 1000 / FRAMES_PER_SECOND);
  }

  newCarNeeded(freeLanes) {
    if (Math.random() < this.carsPerMinute / FRAMES_PER_MINUTE && freeLanes.length > 0) {
      return true;
    }
    return false;
  }
}
