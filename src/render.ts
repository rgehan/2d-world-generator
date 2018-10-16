import { Map } from './generation';

const ID_TO_COLOR: { [k: number]: string } = {
  0: '#3c92e8', // Void
  1: '#564841', // Dirt
  2: '#686a6d', // Stone
  3: '#ce9627', // Gold
  4: '#96613c', // Gold
};

export function renderMap(map: Map, context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;

  const blockSize = Math.floor(width / map.length);

  // Clear the screen
  context.clearRect(0, 0, width, height);

  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      const blockValue = map[x][y];

      context.fillStyle = ID_TO_COLOR[blockValue];

      context.fillRect(
        x * blockSize,
        height - (y + 1) * blockSize,
        blockSize,
        blockSize
      );
    }
  }
}
