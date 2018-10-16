import { Map } from './generation/MapGenerator';
import { Blocks, getBlockColor } from './Blocks';

const MAX_CANVAS_HEIGHT = 500;

export function renderMap(
  map: Map,
  backgroundMap: Map,
  container: HTMLDivElement
) {
  // Dimensions of the container
  const { clientWidth: maxWidth } = container;
  const mapWidth = map.length;
  const mapHeight = map[0].length;

  // Compute the maximum size of a block
  const blockSize = Math.min(
    Math.floor(maxWidth / mapWidth),
    Math.floor(MAX_CANVAS_HEIGHT / mapHeight),
  );

  // Remove an existing canvas
  const existingCanvas = container.querySelector('canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }

  // Create a properly sized canvas
  const canvas = document.createElement('canvas');
  canvas.width = blockSize * mapWidth;
  canvas.height = blockSize * mapHeight;
  container.appendChild(canvas);

  // Get the context from the canvas
  const context = canvas.getContext('2d');

  // Clear the screen
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Render the background
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      context.fillStyle =
        backgroundMap[x][y] === Blocks.EMPTY ? '#3c92e8' : '#262322';

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
