import * as THREE from 'three'
import EventEmitter from 'utils/EventEmitter'

export default class Time extends EventEmitter {
  start: number
  current: number
  elapsed: number
  delta: number
  clock: THREE.Clock
  clockElapsed: number

  constructor() {
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    this.clock = new THREE.Clock()
    this.clockElapsed = 0

    window.requestAnimationFrame(this.tick.bind(this))
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start
    this.clockElapsed = this.clock.getElapsedTime()

    this.trigger('tick')

    window.requestAnimationFrame(this.tick.bind(this))
  }
}
