import { Map } from './generation/MapGenerator';
import { Blocks, getBlockColor } from './Blocks';

export function renderMap(
  map: Map,
  backgroundMap: Map,
  context: CanvasRenderingContext2D
) {
  const { width, height } = context.canvas;
  const mapWidth = map.length;
  const mapHeight = map[0].length;

  const blockSize = Math.floor(width / mapWidth);

  // Clear the screen
  context.clearRect(0, 0, width, height);

  // Render the background
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      context.fillStyle = backgroundMap[x][y] === Blocks.EMPTY
        ? '#3c92e8'
        : '#262322';

      context.fillRect(
        x * blockSize,
        (mapHeight - (y + 1)) * blockSize,
        blockSize,
        blockSize
      );
    }
  }

  // Render the foreground
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      const blockValue = map[x][y];

      if (blockValue === Blocks.EMPTY) {
        continue;
      }

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
