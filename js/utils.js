function getFreeLanes(cars, lanes) {
  const freeLanes = [];
  for (let i = 0; i < lanes; i++) {
    freeLanes.push(i);
  }
  cars
    .filter(car => car.x < CAR_SPAWN_POINT + CAR_WIDTH * 1.5)
    .forEach((car) => {
      delete freeLanes[car.lane];
      delete freeLanes[car.newLane];
    });
  return freeLanes.filter(lane => lane !== undefined);
}

function getImage() {
  const image = Car.images[Math.floor(Math.random() * (Car.images.length - 1) + 1)];
  return image;
}

function spawnCar(cars, freeLanes, x, velocity) {
  const lane = freeLanes[Math.floor(Math.random() * freeLanes.length)];
  cars.push(new Car(x, velocity, lane, getImage()));
}

function isClose(cars, currentCar, lane = currentCar.lane, forward=true) {
  return cars
    .filter(car => (car.lane === lane || car.newLane === lane) && car !== currentCar)
    .some(car => forward ? (currentCar.x < car.x && car.x <= currentCar.x + CAR_WIDTH * 1.5) :
                (car.x < currentCar.x && currentCar.x <= car.x + CAR_WIDTH * 1.5));
}
