import {
  MapGenerator,
  CaveGenerator,
} from './generation/index';
import { renderMap } from './render';
import { getCanvasContext } from './utils';

const mapGenerator = new MapGenerator();

const blankMap = mapGenerator.generate();
const carvedMap = new CaveGenerator(blankMap).generate();

const ctx = getCanvasContext(1000, 600);
renderMap(carvedMap, ctx);
