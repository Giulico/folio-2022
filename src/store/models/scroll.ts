import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

export const scroll = createModel<RootModel>()({
  state: false,
  reducers: {
    canScroll() {
      return true
    },
    stopScroll() {
      return false
    }
  }
})
