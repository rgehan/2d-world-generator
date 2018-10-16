import {
  MapGenerator,
  CaveGenerator,
  OreGenerator,
  LiquidGenerator,
} from './generation/index';
import { renderMap } from './render';
import { getCanvasContext } from './utils';

const mapGenerator = new MapGenerator();

let map = mapGenerator.generate({ size: 7, level: 0.6, roughness: 0.8 });
map = new OreGenerator(map).generate();
map = new CaveGenerator(map).generate();
map = new LiquidGenerator(map).generate();

const ctx = getCanvasContext(600, 400);
renderMap(map, ctx);
