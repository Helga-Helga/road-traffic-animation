window.onload = () => {
  let scene = null;
  Car.images = [];
  const images = Car.getImages();
  for (let i = 1; i <= ITEMS_TO_LOAD; i++) {
    const image = new Image();
    image.src = `pictures/car${i}.png`;
    images.push(image);
    image.onload = Scene.increaseProgress;
  }

  document.getElementById('submit').onclick = () => {
    if (scene != null) {
      scene.stop();
    }
    const canvas = document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');
    const lanesAmount = parseInt(document.getElementById('lanes').value, 10);
    const roadHeight = lanesAmount * LANE_HEIGHT + (lanesAmount - 1) * DELIMITER_HEIGHT;
    const roadWidth = window.innerWidth - 20;
    const carsPerMinute = parseInt(document.getElementById('expectedValue').value, 10);
    scene = new Scene(canvas, canvasContext, lanesAmount, roadHeight, roadWidth, carsPerMinute);
    scene.draw();
  };
};
