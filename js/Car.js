class Car {
  static getImages() {
    return Car.images;
  }

  constructor(x, velocity, lane, image) {
    this.x = x;
    this.velocity = velocity;
    this.lane = lane;
    this.image = image;
    this.newLane = undefined;
    this.laneChangeProgress = 0;
  }

  draw(canvasContext) {
    const newLaneY = this.newLane !== undefined ? LANE_HEIGHT / 3 + LANE_HEIGHT * this.newLane + DELIMITER_HEIGHT * this.newLane : 0;
    const laneY = LANE_HEIGHT / 3 + LANE_HEIGHT * this.lane + DELIMITER_HEIGHT * this.lane;
    const y = laneY * (1 - this.laneChangeProgress) + newLaneY * this.laneChangeProgress;
    canvasContext.drawImage(this.image, this.x, y, CAR_WIDTH, CAR_HEIGHT);
  }

  move(dx) {
    if (this.newLane !== undefined && this.laneChangeProgress < 1) {
        this.x += dx / Math.sqrt(2);
        const newLaneY = LANE_HEIGHT / 3 + LANE_HEIGHT * this.newLane + DELIMITER_HEIGHT * this.newLane;
        const laneY = LANE_HEIGHT / 3 + LANE_HEIGHT * this.lane + DELIMITER_HEIGHT * this.lane;
        this.laneChangeProgress += dx / Math.abs(laneY - newLaneY);
        if (this.laneChangeProgress >= 1) {
            this.laneChangeProgress = 0;
            this.lane = this.newLane;
            this.newLane = undefined;
        }
    } else {
        this.x += dx;
    }
  }

  changeLane(newLane) {
    this.newLane = newLane;
  }
}
