import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

const initialState: {
  open: boolean
  index: number
} = {
  open: false,
  index: -1
}

export const menu = createModel<RootModel>()({
  state: initialState,
  reducers: {
    open(state, payload) {
      return {
        ...state,
        open: payload
      }
    },
    setIndex(state, payload: number) {
      return {
        ...state,
        index: payload
      }
    }
  }
})
