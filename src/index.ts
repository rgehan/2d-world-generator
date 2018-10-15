function createCanvas(w: number, h: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  document.body.appendChild(canvas);

  return canvas.getContext('2d');
}

interface MapGenerationSettings {
  size: number,
  roughness: number,
}

/**
 * Generates a 2d map using midpoint displacement.
 * Roughness is decorrelated from the size of the map.
 * @param param0
 */
function generateMap({ size, roughness }: MapGenerationSettings) {
  const map = Array(size).fill(0);
  let stepSize = size - 1;

  map[0] = 0.5;
  map[size - 1] = 0.5;

  const getRandom = (delta: number) => (Math.random() - 0.5) * (delta / (map.length - 1)) * roughness;

  while (stepSize > 1) {
    for (let x = 0; x < size - 1; x += stepSize) {
      const avg = (map[x] + map[x + stepSize]) / 2;
      map[x + stepSize / 2] = avg + getRandom(stepSize);
    }

    stepSize = stepSize / 2;
  }

  return map;
}

function drawMap(map: number[], context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;

  context.fillStyle = 'green';
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(0, map[0] * height);
  for (let i = 1; i < map.length; i++) {
    context.lineTo(i / (map.length - 1) * width, map[i] * height);
  }
  context.lineTo(width, height);
  context.fill();
  context.closePath();
}

const map = generateMap({ size: 257, roughness: 0.7 });

const ctx = createCanvas(1000, 600);
drawMap(map, ctx);

