import { cloneDeep } from 'lodash';

import { MapGenerator } from './MapGenerator';
import { CaveGenerator } from './CaveGenerator';
import { OreGenerator } from './OreGenerator';
import { LiquidGenerator } from './LiquidGenerator';
import { TreeGenerator } from './TreeGenerator';
import { Blocks } from '../Blocks';

export interface GenerationConfiguration {
  map: {
    size: number,
    level: number,
    roughness: number,
    mapHeight: number,
  },
  caves: {
    count: number,
    forkCapacity: number,
  },
  water: {
    amount: number,
    iterations: number,
  },
  trees: {
    probability: number,
  },
};

export function generate(config: GenerationConfiguration) {
  const mapGenerator = new MapGenerator();
  const originalMap = mapGenerator.generate({
    size: config.map.size,
    level: config.map.level,
    roughness: config.map.roughness,
    mapHeight: config.map.mapHeight,
  });

  let map = cloneDeep(originalMap);

  // Generate underground stuff
  map = new OreGenerator(map).generate([
    { blockId: Blocks.STONE, size: 0.3, amount: 0.3 },
    { blockId: Blocks.GOLD, size: 0.08, amount: 0.07 },
    { blockId: Blocks.COPPER, size: 0.09, amount: 0.085 },
    { blockId: Blocks.COAL, size: 0.12, amount: 0.1 },
  ]);

  // Generate caves
  map = new CaveGenerator(map).generate({
    count: config.caves.count,
    forkCapacity: config.caves.forkCapacity,
  });

  // Generate liquids
  map = new LiquidGenerator(map).generate({
    amount: config.water.amount,
    iterations: config.water.iterations,
  });

  // Generate trees
  map = new TreeGenerator(map).generate({
    proba: config.trees.probability,
  });

  return {
    map,
    backgroundMap: originalMap,
  };
}
