import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

export const images = createModel<RootModel>()({
  state: {},
  reducers: {
    addImage(state, payload) {
      return {
        ...state,
        [payload.name]: {
          hover: false,
          sizes: payload.sizes
        }
      }
    },
    showImage(state, payload) {
      const name = payload as string
      const imageObj = (state as { [name: string]: any })[name]
      return {
        ...state,
        [name]: {
          ...imageObj,
          hover: true
        }
      }
    },
    hideImage(state, payload) {
      const name = payload as string
      const imageObj = (state as { [name: string]: any })[name]
      return {
        ...state,
        [name]: {
          ...imageObj,
          hover: false
        }
      }
    }
  }
})
