import type { ReactElement } from 'react'
declare global {
  interface Array<T> {
    equals(o: T): Array<T> | undefined
  }
}

export const randomItem = (array: string[]): string =>
  array[Math.floor(Math.random() * array.length)]

export const nextItem = (array: string[][], currentItem: string[]): string[] => {
  const currentIndex = array.indexOf(currentItem)
  const bound = array.length
  const nextIndex = (currentIndex + bound + 1) % bound
  return array[nextIndex]
}

export function arrayEquals(array1: any[], array2: any[]) {
  // if the other array is a falsy value, return
  if (!array2) return false

  // compare lengths - can save a lot of time
  if (array1.length != array2.length) return false

  for (let i = 0, l = array1.length; i < l; i++) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arrayEquals(array1[i], array2[i])) return false
    } else if (array1[i] != array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
