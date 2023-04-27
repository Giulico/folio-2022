import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

export const app = createModel<RootModel>()({
  state: {
    loaded: false,
    ready: false,
    loadingProgress: 0
  },
  reducers: {
    setLoaded(state) {
      return {
        ...state,
        loaded: true
      }
    },
    setReady(state) {
      return {
        ...state,
        ready: true
      }
    },
    setLoadingProgress(state, payload) {
      return {
        ...state,
        loadingProgress: payload
      }
    }
  }
})
