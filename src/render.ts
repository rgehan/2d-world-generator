import { Map } from './generation';

export function renderMap(map: Map, context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;

  const blockSize = Math.floor(width / map.length);

  // Clear the screen
  context.clearRect(0, 0, width, height);

  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      const blockValue = map[x][y];

      context.fillStyle = blockValue === 1 ? '#564841' : '#3c92e8';

      context.fillRect(
        x * blockSize,
        height - (y + 1) * blockSize,
        blockSize,
        blockSize
      );
    }
  }
}
