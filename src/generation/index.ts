import { cloneDeep } from 'lodash';

import { MapGenerator } from './MapGenerator';
import { CaveGenerator } from './CaveGenerator';
import { OreGenerator } from './OreGenerator';
import { LiquidGenerator } from './LiquidGenerator';
import { TreeGenerator } from './TreeGenerator';
import { Blocks } from '../Blocks';

export function generate() {
  const mapGenerator = new MapGenerator();
  const originalMap = mapGenerator.generate({
    size: 8,
    level: 0.5,
    roughness: 0.8,
    mapHeight: 150,
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
    count: 30,
    forkCapacity: 5,
  });

  // Generate liquids
  map = new LiquidGenerator(map).generate({
    amount: 2,
    iterations: 1000,
  });

  // Generate trees
  map = new TreeGenerator(map).generate({
    proba: 0.3,
  });

  return {
    map,
    backgroundMap: originalMap,
  };
}
