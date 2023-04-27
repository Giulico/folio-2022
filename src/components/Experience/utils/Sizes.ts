import EventEmitter from 'utils/EventEmitter'
import StoreWatcher from './StoreWatcher'
import type { RootState } from 'store'
export default class Sizes extends EventEmitter {
  width: number
  height: number
  pixelRatio: number

  constructor() {
    super()

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Store change listener
    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    if (
      state.sizes.width !== prevState.sizes.width ||
      state.sizes.height !== prevState.sizes.height
    ) {
      this.width = state.sizes.width
      this.height = state.sizes.height
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      this.trigger('resize')
    }
  }
}
