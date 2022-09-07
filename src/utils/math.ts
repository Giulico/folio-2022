/** Scale a value from one range to another
 * https://gist.github.com/fpillet/993002
 * Example of use:
 *
 * Convert 33 from a 0-100 range to a 0-65535 range
 * var n = scaleValue(33, [0,100], [0,65535]);
 *
 * Ranges don't have to be positive
 * var n = scaleValue(0, [-50,+50], [0,65535]);
 *
 * Ranges are defined as arrays of two values, inclusive
 */
export function scaleValue(value: number, from: [number, number], to: [number, number]) {
  const scale = (to[1] - to[0]) / (from[1] - from[0])
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return capped * scale + to[0]
}

/** Keep a number between a range */
export function betweenRange(value: number, min: number, max: number) {
  if (value < min) return min
  if (value > max) return max
  return value
}

export function toFixedNumber(num: number, digits: number, base: number): number {
  const pow = Math.pow(base || 10, digits)
  return Math.round(num * pow) / pow
}

export function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
