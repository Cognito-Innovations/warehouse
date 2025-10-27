export const formatDimensions = (value: number | string) => {
  const number = parseFloat(String(value));
  return Number.isInteger(number) ? number.toString() : number.toFixed(2).replace(/\.?0+$/, '');
}