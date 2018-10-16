function createCanvasContext(): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');

  canvas.width = window.innerWidth - 20;
  canvas.height = canvas.width / 16 * 10;

  document.body.appendChild(canvas);

  return canvas.getContext('2d');
}

export function getCanvasContext(): CanvasRenderingContext2D {
  const canvas = document.querySelector('canvas');
  return canvas ? canvas.getContext('2d') : createCanvasContext();
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
