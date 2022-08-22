import EventEmitter from 'utils/EventEmitter'
import { debounce } from 'ts-debounce'

export default class Sizes extends EventEmitter {
  width: number
  height: number
  pixelRatio: number
  debouncedResizeHandler: () => void

  constructor() {
    super()

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.debouncedResizeHandler = debounce(this.resizeHandler.bind(this), 300)

    window.addEventListener('resize', this.debouncedResizeHandler)
  }

  resizeHandler() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.trigger('resize')
  }
}
