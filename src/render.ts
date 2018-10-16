import { Map } from './generation';
import { getBlockColor } from './Blocks'

export function renderMap(map: Map, context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;

  const blockSize = Math.floor(width / map.length);

  // Clear the screen
  context.clearRect(0, 0, width, height);

  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      const blockValue = map[x][y];

      context.fillStyle = getBlockColor(blockValue);

      context.fillRect(
        x * blockSize,
        height - (y + 1) * blockSize,
        blockSize,
        blockSize
      );
    }
  }
}
