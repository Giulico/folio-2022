import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

export const sizes = createModel<RootModel>()({
  state: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  reducers: {
    update(state, payload) {
      return payload
    }
  }
})
