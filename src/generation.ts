import { clamp } from './utils';

interface HeightMapGenerationSettings {
  size: number;
  roughness: number | Function;
  level: number;
}

type HeightMap = number[];
export type Map = number[][];

/**
 * Generates a 2d map using midpoint displacement.
 * Roughness is decorrelated from the size of the map.
 * @param options.size
 * @param options.roughness
 */
export function generateHeightMap({
  size,
  roughness,
  level = 0.5,
}: HeightMapGenerationSettings) {
  const map: HeightMap = Array(size).fill(0);
  let stepSize = size - 1;

  map[0] = map[size - 1] = level;

  const getRandom = (delta: number, x: number) => {
    const normalizedDelta = delta / (map.length - 1);
    const normalizedX = x / (map.length - 1);

    const _roughness =
      typeof roughness === 'function'
        ? roughness(normalizedDelta, normalizedX)
        : roughness;

    return (Math.random() - 0.5) * normalizedDelta * _roughness;
  };

  while (stepSize > 1) {
    for (let x = 0; x < size - 1; x += stepSize) {
      const avg = (map[x] + map[x + stepSize]) / 2;
      map[x + stepSize / 2] = clamp(
        avg + getRandom(stepSize, x + stepSize / 2),
        0,
        1
      );
    }

    stepSize = stepSize / 2;
  }

  return map;
}

export function heightMapToBlocks(
  heightMap: HeightMap,
  targetHeight: number
) {
  const width = heightMap.length;

  const map = [];

  for (let x = 0; x < width; x++) {
    const height = heightMap[x];
    const steppedHeight = Math.ceil(height * targetHeight);
    map[x] = [
      ...Array(steppedHeight).fill(1),
      ...Array(targetHeight - steppedHeight).fill(0),
    ];
  }

  return map;
}

export function generateCaves(map: Map) {
  // TODO
}
