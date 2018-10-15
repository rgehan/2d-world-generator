interface HeightMapGenerationSettings {
  size: number;
  roughness: number | Function;
}

type HeightMap = number[];

/**
 * Generates a 2d map using midpoint displacement.
 * Roughness is decorrelated from the size of the map.
 * @param options.size
 * @param options.roughness
 */
export function generateHeightMap({
  size,
  roughness,
}: HeightMapGenerationSettings) {
  const map: HeightMap = Array(size).fill(0);
  let stepSize = size - 1;

  map[0] = 0.5;
  map[size - 1] = 0.5;

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
      map[x + stepSize / 2] = avg + getRandom(stepSize, x + stepSize / 2);
    }

    stepSize = stepSize / 2;
  }

  return map;
}

export function generateCaves(map: HeightMap) {
  // TODO
}
