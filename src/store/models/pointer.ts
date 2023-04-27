import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

const initialState: {
  type: string
} = {
  type: 'default'
}

export const pointer = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setType(state, payload: string) {
      return {
        ...state,
        type: payload
      }
    }
  }
})
