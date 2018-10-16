import { clamp } from '../utils';
import { Blocks } from '../Blocks';

interface HeightMapGenerationSettings {
  size: number;
  level: number;
  roughness: number | Function;
  mapHeight?: number;
}

type HeightMap = number[];
export type Map = number[][];

export class MapGenerator {
  generate({
    size,
    level = 0.6,
    roughness = 0.8,
    mapHeight = 80,
  }: HeightMapGenerationSettings) {
    const heightMap = this._generateHeightMap({
      size: 2 ** size + 1,
      level,
      roughness,
    });

    return this._convertHeightMapToBlocks(heightMap, mapHeight);
  }

  /**
   * Generates a 2d map using midpoint displacement.
   * Roughness is decorrelated from the size of the map.
   * @param options.size
   * @param options.roughness
   */
  _generateHeightMap({
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

  _convertHeightMapToBlocks(heightMap: HeightMap, targetHeight: number) {
    const width = heightMap.length;

    const map = [];

    for (let x = 0; x < width; x++) {
      const height = heightMap[x];
      const steppedHeight = Math.ceil(height * targetHeight);
      map[x] = [
        ...Array(steppedHeight - 1).fill(Blocks.DIRT),
        Blocks.GRASS,
        ...Array(targetHeight - steppedHeight).fill(Blocks.EMPTY),
      ];
    }

    return map;
  }
}
