export function seedRandom(seed: number) {
  Math.random = () => {
    const n = Math.sin(seed++) * 10000;
    return n - Math.floor(n);
  };
};

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
