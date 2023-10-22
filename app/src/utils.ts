export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateNewCoordinates(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  distance: number
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const newX = x1 + distance * Math.cos(angle);
  const newY = y1 + distance * Math.sin(angle);
  return { x: newX, y: newY };
}