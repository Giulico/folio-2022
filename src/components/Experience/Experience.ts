import * as THREE from 'three'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import Renderer from './Renderer'
import World from './world/World'
import StoreWatcher from './utils/StoreWatcher'
import Resources from './utils/Resources'
import sources from './sources'
import Loader from './Loader'

import Debug from './utils/Debug'

export type ExperienceConfig = {
  targetElement?: HTMLCanvasElement | undefined
}

// Singleton
let instance: Experience | null = null

export default class Experience {
  canvas: HTMLCanvasElement | undefined
  debug!: Debug
  sizes!: Sizes
  time!: Time
  scene!: THREE.Scene
  renderer!: Renderer
  resources!: Resources
  world!: World
  loader!: Loader

  constructor(config: ExperienceConfig = {}) {
    if (instance) {
      return instance
    }
    // Singleton
    instance = this

    // Global access
    window.experience = this

    new StoreWatcher()

    this.canvas = config.targetElement

    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()

    this.scene = new THREE.Scene()
    // this.scene.fog = new THREE.Fog(0x000000, 3, 10);
    this.renderer = new Renderer()
    this.resources = new Resources(sources, this.renderer.instance)

    this.world = new World()
    this.loader = new Loader() // Loader needs camera

    this.sizes.on('resize', this.resize.bind(this))

    this.time.on('tick', this.update.bind(this))

    // this.renderer.setComposer()
    this.resources.on('ready', () => {
      this.renderer.setOrbitControls()
      this.renderer.setComposer()

      this.loader.onReady()
    })
  }

  resize() {
    this.world.resize()
    this.renderer.resize()
  }

  update() {
    this.loader.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    // Remove listeners
    this.sizes.off('resize')
    this.time.off('tick')

    // Traverse the whole scene and dispose
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        for (const key in child.material) {
          const value = child.material[key]
          if (typeof value?.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    // dispose camera
    // this.camera.controls.dispose();
    // dispose renderer
    this.renderer.instance.dispose()

    // dispose debug
    if (this.debug.active && this.debug.ui) {
      this.debug.ui.destroy()
    }
  }
}
