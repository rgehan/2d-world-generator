export function drawHeightMap(
  map: number[],
  context: CanvasRenderingContext2D
) {
  const { width, height } = context.canvas;

  context.clearRect(0, 0, width, height);

  context.fillStyle = 'green';
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(0, map[0] * height);
  for (let i = 1; i < map.length; i++) {
    context.lineTo((i / (map.length - 1)) * width, map[i] * height);
  }
  context.lineTo(width, height);
  context.fill();
  context.closePath();
}
