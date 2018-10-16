import SimplexNoise from 'simplex-noise';

import { Map } from './MapGenerator';
import { Blocks } from '../Blocks';

type Step = {
  blockId: number,
  size: number,
  amount: number,
};

const STEPS: Step[] = [
  { blockId: Blocks.STONE, size: 0.3, amount: 0.3 },
  { blockId: Blocks.GOLD, size: 0.08, amount: 0.07 },
  { blockId: Blocks.COPPER, size: 0.09, amount: 0.085 },
  { blockId: Blocks.COAL, size: 0.12, amount: 0.1 },
];

const BLOCKS_WHITELIST = [
  Blocks.DIRT,
];

export class OreGenerator {
  map: Map;
  simplex: SimplexNoise;

  constructor(map: Map) {
    this.map = map;
  }

  generate() {
    STEPS.forEach(step => this._runStep(step));

    return this.map;
  }

  _runStep({ blockId, size, amount }: Step) {
    this.simplex = new SimplexNoise();

    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[x].length; y++) {
        const val = this._getRandomValue(x, y, size);

        if (val < amount && BLOCKS_WHITELIST.indexOf(this.map[x][y]) !== -1) {
          this.map[x][y] = blockId;
        }
      }
    }
  }

  /**
   * Generates a random value using Perlin noise, bound between 0 and 1
   * @param x
   * @param y
   */
  _getRandomValue(x: number, y: number, size: number) {
    const coeff = 10 + 40 * size;
    return (this.simplex.noise2D(x / coeff, y / coeff) + 1) / 2;
  }
}
