import { Map } from './MapGenerator';
import { Blocks } from '../Blocks';
import { randomBetween } from '../utils';

const TREE_GEN_PROBA = 0.15;

// prettier-ignore
const TREE_PATTERNS = [
  [
    '  d  ',
    '  d  ',
    ' ddd ',
    ' ddd ',
    'ddddd',
    'ddddd',
    '  #  ',
    '  #  ',
  ],
  [
    ' lll ',
    'lllll',
    'lllll',
    'lllll',
    '  #  ',
    '  #  ',
    '  #  ',
  ],
  [
    '  d  ',
    ' ddd ',
    ' ddd ',
    ' ddd ',
    ' ddd ',
    ' ddd ',
    ' ddd ',
    ' ddd ',
    ' ddd ',
    '  #  ',
    '  #  ',
  ],
];

export class TreeGenerator {
  map: Map;

  constructor(map: Map) {
    this.map = map;
  }

  generate() {
    const mapWidth = this.map.length;
    const mapHeight = this.map[0].length;

    for (let x = 0; x < mapWidth; x++) {
      let y = mapHeight - 1;
      while (this.map[x][y] === Blocks.EMPTY) {
        y--;
      }

      const blockValue = this.map[x][y];

      if (blockValue !== Blocks.GRASS) continue;
      if (Math.random() >= TREE_GEN_PROBA) continue;

      this._makeTreeFrom(x, y);
    }

    return this.map;
  }

  _makeTreeFrom(x: number, y: number) {
    const mapWidth = this.map.length;
    const mapHeight = this.map[0].length;

    const pattern = TREE_PATTERNS[randomBetween(0, TREE_PATTERNS.length)];

    for (let ty = 0; ty < pattern.length; ty++) {
      for (let tx = 0; tx < pattern[ty].length; tx++) {
        const symbol = pattern[ty][tx];

        if (symbol === ' ') {
          continue;
        }

        const newX = x + (tx - 2);
        const newY = y - ty + pattern.length;

        if (newX < 0 || newY < 0 || newX >= mapWidth || newY >= mapHeight) {
          continue;
        }

        const blockValue =
          symbol === 'l'
            ? Blocks.LEAF
            : symbol === 'd'
              ? Blocks.DARKLEAF
              : Blocks.COAL;

        this.map[newX][newY] = blockValue;
      }
    }
  }
}
