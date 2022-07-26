import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

const initialState: {
  open: boolean
  refs: HTMLDivElement[]
} = {
  open: false,
  refs: []
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
    addRef(state, payload: HTMLDivElement) {
      return {
        ...state,
        refs: [...state.refs, payload]
      }
    }
  }
})
