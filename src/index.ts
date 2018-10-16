import {
  MapGenerator,
  CaveGenerator,
  OreGenerator,
} from './generation/index';
import { renderMap } from './render';
import { getCanvasContext } from './utils';

const mapGenerator = new MapGenerator();

let map = mapGenerator.generate(7, 0.6, 0.6);
map = new OreGenerator(map).generate();
map = new CaveGenerator(map).generate();

const ctx = getCanvasContext(600, 400);
renderMap(map, ctx);
