export function createCanvas(w: number, h: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  document.body.appendChild(canvas);

  return canvas.getContext('2d');
}
