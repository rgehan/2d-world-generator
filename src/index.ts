import { generateHeightMap, generateCaves } from './generation';
import { drawHeightMap } from './render';
import { getCanvasContext } from './utils';

const map = generateHeightMap({
  size: 1025,
  roughness: 0.5,
});

const caves = generateCaves(map);

const ctx = getCanvasContext(1000, 600);
drawHeightMap(map, ctx);
