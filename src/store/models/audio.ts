import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

const initialState: {
  mute: boolean
} = {
  mute: false
}

export const audio = createModel<RootModel>()({
  state: initialState,
  reducers: {
    mute(state) {
      return {
        ...state,
        mute: true
      }
    },
    unmute(state) {
      return {
        ...state,
        mute: false
      }
    }
  }
})
