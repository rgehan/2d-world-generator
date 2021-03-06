import { random } from '../random';

import { Map } from './MapGenerator';
import { Blocks } from '../Blocks';

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
];

const PATTERNS = [
  {
    probaUp: 0.30,
    probaDown: 0,
    pattern: [
      '     ',
      '  X  ',
      '  #  ',
      '     ',
      '     ',
    ],
  },
  {
    probaUp: 0.16,
    probaDown: 0.55,
    pattern: [
      '     ',
      '  X  ',
      ' X#X ',
      '  X  ',
      '     ',
    ],
  },
  {
    probaUp: 0.07,
    probaDown: 0.60,
    pattern: [
      '     ',
      '  XX ',
      ' X#X ',
      ' XX  ',
      '     ',
    ],
  },
  {
    probaUp: 0,
    probaDown: 0.80,
    pattern: [
      '  X  ',
      ' XXX ',
      'XX#XX',
      ' XXX ',
      '  X  ',
    ],
  },
];

interface CaveGenerationSettings {
  count: number,
  forkCapacity: number,
};

/**
 * Handles the cave carving logic
 */
export class CaveGenerator {
  tracers: Tracer[];
  map: Map;

  static INITIAL_TRACERS_COUNT = 10;

  constructor(map: Map) {
    this.map = map;
    this.tracers = [];

  }

  generate({ count = 10, forkCapacity = 10 }: CaveGenerationSettings) {
    for (let i = 0; i < count; i++) {
      this.tracers.push(this._createRandomTracer(forkCapacity));
    }

    while (this.tracers.length !== 0) {
      this.tracers.forEach(tracer => {
        this.trace(tracer);
      });

      this.tracers = this.tracers.filter(tracer => !tracer.isDone);
    }

    this._replacePatternBorderWithVoid();

    return this.map;
  }

  trace(tracer: Tracer) {
    // Move the tracer
    tracer.update(this);

    if (tracer.shouldFork()) {
      this.tracers.push(tracer.fork());
    }

    // Apply the tracer on the map
    const { x, y } = tracer;
    if (this.inGround(x, y)) {
      this._carvePattern(x, y, PATTERNS[tracer.pattern].pattern);
    }
  }

  _carvePattern(posX: number, posY: number, pattern: string[]) {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const dy = y - 2;
        const dx = x - 2;
        const symbol = pattern[y][x];

        if (symbol === ' ') {
          continue;
        }

        const newX = posX + dx;
        const newY = posY + dy;

        if (newX < 0 || newY < 0 || newX >= this._getWidth() || newY >= this._getHeight()) {
          continue;
        }


        this.map[newX][newY] = symbol === '#' ? Blocks.EMPTY : 9999;
      }
    }
  }

  _replacePatternBorderWithVoid() {
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[x].length; y++) {
        const blockValue = this.map[x][y];
        this.map[x][y] = blockValue === 9999 ? 0 : blockValue;
      }
    }
  }

  _createRandomTracer(forkCapacity: number): Tracer {
    let x: number;
    let y: number;

    do {
      x = random(0, this._getWidth());
      y = random(0, this._getHeight());
    } while (!this.inGround(x, y));

    return new Tracer(x, y, 0, forkCapacity);
  }

  _getWidth() {
    return this.map.length;
  }

  _getHeight() {
    return this.map[0].length;
  }

  inGround(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this._getWidth() || y >= this._getHeight()) {
      return false;
    }

    const blockValue = this.map[x][y];
    return blockValue !== Blocks.EMPTY;
  }
}

/**
 * A tracer will move and carve a cave inside the map
 */
class Tracer {
  x: number;
  y: number;
  direction: number;
  movesSinceLastTurn: number;
  movesSinceLastResize: number;
  forkCapacity: number;
  isDone = false;
  pattern = 0;

  static FORCE_TURN_AFTER_N_MOVES = 3;

  constructor(
    x: number,
    y: number,
    direction: number,
    forkCapacity: number,
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.movesSinceLastTurn = 0;
    this.movesSinceLastResize = 0;
    this.forkCapacity = forkCapacity;
  }

  update(generator: CaveGenerator) {
    this.x += DIRECTIONS[this.direction].x;
    this.y += DIRECTIONS[this.direction].y;

    if (!generator.inGround(this.x, this.y)) {
      this.isDone = true;
      return;
    }

    this.movesSinceLastTurn++;
    this.movesSinceLastResize++;

    this.turn();

    this.resize();
  }

  turn() {
    if (!this._shouldTurn()) {
      return;
    }

    this.direction = this._getNewDirection();
    this.movesSinceLastTurn = 0;
  }

  resize() {
    const { probaUp, probaDown } = PATTERNS[this.pattern];

    if (this.movesSinceLastResize < 4) {
      return;
    }

    if (Math.random() <= probaDown) {
      this.pattern--;
      this.movesSinceLastResize = 0;
    } else if (Math.random() <= probaUp) {
      this.pattern++;
      this.movesSinceLastResize = 0;
    }
  }

  shouldFork() {
    return this.forkCapacity > 0 && Math.random() > 0.99;
  }

  fork() {
    this.forkCapacity--;

    return new Tracer(
      this.x,
      this.y,
      this._getNewDirection(),
      this.forkCapacity - 1
    );
  }

  _shouldTurn() {
    const threshold =
      (this.movesSinceLastTurn / Tracer.FORCE_TURN_AFTER_N_MOVES) ** 2;

    return Math.random() <= threshold;
  }

  _getNewDirection() {
    const turnDirection = Math.random() < 0.5 ? 1 : DIRECTIONS.length - 1;
    return (this.direction + turnDirection) % DIRECTIONS.length;
  }
}
