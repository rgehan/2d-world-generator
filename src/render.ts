import { Map } from './generation';
import { getBlockColor } from './Blocks'

export function renderMap(map: Map, context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  const mapWidth = map.length;
  const mapHeight = map[0].length;

  const blockSize = Math.floor(width / mapWidth);

  // Clear the screen
  context.clearRect(0, 0, width, height);

  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      const blockValue = map[x][y];

      context.fillStyle = getBlockColor(blockValue);

      context.fillRect(
        x * blockSize,
        (mapHeight - (y + 1)) * blockSize,
        blockSize,
        blockSize
      );
    }
  }
}
