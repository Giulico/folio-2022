import type { RootState, Store } from 'store'

import EventEmitter from 'utils/EventEmitter'

let instance: StoreWatcher | null = null

export default class StoreWatcher extends EventEmitter {
  store!: Store
  prevState!: RootState
  callbacks: { (state: RootState, prevState: RootState): void }[] = []

  constructor() {
    super()

    if (instance) {
      return instance
    }
    // Singleton
    instance = this

    this.store = window.store
    this.prevState = this.store.getState()

    this.subscribe()
  }

  subscribe() {
    this.store.subscribe(() => {
      const state = this.store.getState()

      for (const callback of this.callbacks) {
        callback(state, this.prevState)
      }

      this.prevState = state
    })
  }

  addListener(callback: (state: RootState, prevState: RootState) => void) {
    this.callbacks.push(callback)
  }
}
