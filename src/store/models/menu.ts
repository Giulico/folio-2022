import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

const initialState: {
  open: boolean
  refs: HTMLDivElement[]
  index: number
  triggerY: number
} = {
  open: false,
  refs: [],
  index: -1,
  triggerY: 0
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
    },
    setIndex(state, payload: number) {
      return {
        ...state,
        index: payload
      }
    },
    setTriggerY(state, payload: number) {
      return {
        ...state,
        triggerY: payload
      }
    }
  }
})
