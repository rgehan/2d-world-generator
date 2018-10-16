import { cloneDeep } from 'lodash';

import {
  MapGenerator,
  CaveGenerator,
  OreGenerator,
  LiquidGenerator,
  TreeGenerator,
} from './generation/index';
import { renderMap } from './render';
import { getCanvasContext } from './utils';

const mapGenerator = new MapGenerator();

const originalMap = mapGenerator.generate({
  size: 8,
  level: 0.5,
  roughness: 0.8,
});

let map = cloneDeep(originalMap);
map = new OreGenerator(map).generate();
map = new CaveGenerator(map).generate();
map = new LiquidGenerator(map).generate();
map = new TreeGenerator(map).generate();

const ctx = getCanvasContext();
renderMap(map, originalMap, ctx);
