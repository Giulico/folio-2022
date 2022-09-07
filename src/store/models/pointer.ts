import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

const initialState: {
  type: string
  label: string
} = {
  type: 'default',
  label: ''
}

export const pointer = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setType(state, payload: string) {
      return {
        ...state,
        type: payload
      }
    },
    setLabel(state, payload: string) {
      return {
        ...state,
        label: payload
      }
    }
  }
})
