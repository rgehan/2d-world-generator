import {
  generateHeightMap,
  heightMapToBlocks,
  generateCaves,
} from './generation';
import { renderMap } from './render';
import { getCanvasContext } from './utils';

const heightMap = generateHeightMap({
  size: 129,
  level: 0.5,
  roughness: 0.9,
});

const map = heightMapToBlocks(heightMap, 80);

const ctx = getCanvasContext(1000, 600);
renderMap(map, ctx);
