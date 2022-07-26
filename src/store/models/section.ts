import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

type Boundary = {
  name: string
  start: number
  end: number
}

export const section = createModel<RootModel>()({
  state: {
    current: 'hero',
    boundaries: [] as Boundary[]
  },
  reducers: {
    update(state, payload) {
      return {
        ...state,
        current: payload
      }
    },
    setBoundary(state, payload) {
      const currentIndex = state.boundaries.findIndex(
        (boundary) => boundary.name === payload.name
      )
      if (currentIndex > -1) {
        return {
          ...state,
          boundaries: [
            ...state.boundaries.slice(0, currentIndex),
            payload,
            ...state.boundaries.slice(currentIndex + 1)
          ]
        }
      } else {
        return {
          ...state,
          boundaries: [...state.boundaries, payload]
        }
      }
    }
  }
})
