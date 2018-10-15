import { generateHeightMap } from './generation';
import { drawHeightMap } from './render';
import { createCanvas } from './utils';

const map = generateHeightMap({
  size: 1025,
  roughness: 0.5,
});

const ctx = createCanvas(1000, 600);
drawHeightMap(map, ctx);
