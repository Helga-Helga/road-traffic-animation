class CarLaneManager {
  constructor(currentLane) {
    this.position = { currentLane: 1 };
    this.currentLane = currentLane;
    this.newLane = null;
  }

  startMotion(newLane) {
    if (!(newLane in this.position)) {
      this.position[newLane] = 0;
      this.newLane = newLane;
    }
  }

  moveToLane(delta) {
    this.position[this.newLane] += delta;
    this.position[this.currentLane] -= delta;
    if (this.position[this.currentLane] <= 0) {
      delete this.position[this.currentLane];
      this.currentLane = this.newLane;
      this.newLane = null;
    }
  }

  isMoving() {
    if (this.newLane === null) {
      return false;
    }
    else {
      return true;
    }
  }
}
