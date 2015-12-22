export function factor(x: number): number[] {
  for (let c = 2; c < Math.floor(Math.sqrt(x)) + 1; c++) {
    if (x % c === 0) {
      return [c, ...factor(Math.floor(x / c))];
    }
  }
  return [x];
}
