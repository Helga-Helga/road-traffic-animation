class Car {
  static getImages() {
    return Car.images;
  }

  constructor(x, velocity, lane, image) {
    this.x = x;
    this.velocity = velocity;
    this.lane = lane;
    this.image = image;
  }

  draw(canvasContext) {
    const y = LANE_HEIGHT / 3 + LANE_HEIGHT * this.lane + DELIMITER_HEIGHT * this.lane;
    canvasContext.drawImage(this.image, this.x, y, CAR_WIDTH, CAR_HEIGHT);
  }

  move(dx) {
    this.x += dx;
  }

  changeLane(newLane) {
    this.lane = newLane;
  }
}
