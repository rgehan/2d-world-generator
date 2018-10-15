function createCanvasContext(w: number, h: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  document.body.appendChild(canvas);

  return canvas.getContext('2d');
}

export function getCanvasContext(
  w: number,
  h: number
): CanvasRenderingContext2D {
  const canvas = document.querySelector('canvas');
  return canvas ? canvas.getContext('2d') : createCanvasContext(w, h);
}
