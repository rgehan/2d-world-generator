export enum Blocks {
  EMPTY = 0,
  DIRT = 1,
  STONE = 2,
  GOLD = 3,
  COPPER = 4,
  COAL = 5,
  GRASS = 6,
  WATER = 7,
};

const BLOCKS_COLORS = {
  [Blocks.EMPTY]: '#3c92e8',
  [Blocks.DIRT]: '#564841',
  [Blocks.STONE]: '#686a6d',
  [Blocks.GOLD]: '#ce9627',
  [Blocks.COPPER]: '#96613c',
  [Blocks.COAL]: '#333333',
  [Blocks.GRASS]: '#4b771f',
  [Blocks.WATER]: 'blue',
};

export function getBlockColor(block: Blocks) {
  return BLOCKS_COLORS[block];
}
