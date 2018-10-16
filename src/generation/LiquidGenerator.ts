import { Map } from './MapGenerator';
import { Blocks } from '../Blocks';

type LiquidParticle = {
  x: number;
  y: number;
};

interface LiquidGenerationSettings {
  amount: number,
  iterations: number,
}

export class LiquidGenerator {
  map: Map;
  particles: LiquidParticle[];

  constructor(map: Map) {
    this.map = map;
    this.particles = [];
  }

  generate({ amount = 1, iterations = 1000 }: LiquidGenerationSettings) {
    // Generate n-thick layer of water on the map
    this._generateInitialLayer(amount);

    for (let i = 0; i < iterations; i++) {
      this._updateParticles();
    }

    this._cleanupParticles();
    this._applyParticles();

    return this.map;
  }

  _generateInitialLayer(thickness: number = 1) {
    for (let x = 0; x < this.map.length; x++) {
      for (let i = thickness - 1; i >= 0; i--) {
        this.particles.push({
          x,
          y: this.map[x].length - 1 - i,
        });
      }
    }
  }

  _cleanupParticles() {
    for (let i = 0; i < 10; i++) {
      this.particles = this.particles.filter(particle => {
        const { x, y } = particle;
        const left = this._getBlockTypeAt(x - 1, y);
        const particleLeft = this._hasParticleAt(x - 1, y);
        const right = this._getBlockTypeAt(x + 1, y);
        const particleRight = this._hasParticleAt(x + 1, y);

        return (
          (particleLeft || left !== Blocks.EMPTY) &&
          (particleRight || right !== Blocks.EMPTY)
        );
      });
    }
  }

  _updateParticles() {
    for (const particle of this.particles) {
      let { x, y } = particle;

      // While there's room below, fall.
      while (
        this.map[x][y - 1] === Blocks.EMPTY &&
        !this._hasParticleAt(x, y - 1)
      ) {
        y--;
      }

      particle.x = x;
      particle.y = y;
    }

    // Move left/right if possible
    for (const particle of this.particles) {
      let { x, y } = particle;

      const left = this._getBlockTypeAt(x - 1, y);
      const particleLeft = this._hasParticleAt(x - 1, y);
      const right = this._getBlockTypeAt(x + 1, y);
      const particleRight = this._hasParticleAt(x + 1, y);

      const canGoLeft = left === Blocks.EMPTY && !particleLeft;
      const canGoRight = right === Blocks.EMPTY && !particleRight;

      const direction =
        canGoLeft && canGoRight
          ? Math.random() > 0.5
            ? 'left'
            : 'right'
          : canGoLeft
            ? 'left'
            : canGoRight
              ? 'right'
              : null;

      if (direction === 'left') {
        x--;
      } else if (direction === 'right') {
        x++;
      }

      particle.x = x;
      particle.y = y;
    }
  }

  _applyParticles() {
    for (const particle of this.particles) {
      const { x, y } = particle;

      this.map[x][y] = Blocks.WATER;
    }
  }

  _getBlockTypeAt(x: number, y: number) {
    if (x < 0 || x >= this.map.length || y < 0 || y >= this.map[0].length) {
      return null;
    }

    return this.map[x][y];
  }

  // TODO Optimize
  _hasParticleAt(x: number, y: number) {
    return !!this.particles.find(
      particle => particle.x === x && particle.y === y
    );
  }
}
