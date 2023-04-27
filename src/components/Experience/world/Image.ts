// Types
import type { RootState } from 'store'

// Utils
import { gsap } from 'gsap'
import * as THREE from 'three'
import lerp from 'utils/lerp'
import StoreWatcher from '../utils/StoreWatcher'

// Components
import Experience from '../Experience'

// Shaders
import vertexShader from './shaders/image/vertex'
import fragmentShader from './shaders/image/fragment'

type Settings = {
  name: string
  sizes: [number, number]
}

export default class Image {
  settings: Settings
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  time: Experience['time']
  camera: THREE.PerspectiveCamera
  geometry!: THREE.BufferGeometry
  material!: THREE.ShaderMaterial
  mesh!: THREE.Mesh
  isVisible: boolean
  cursorOffset: {
    x: number
    y: number
  }

  constructor(settings: Settings) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.settings = settings
    this.cursorOffset = { x: 0, y: 0 }
    this.isVisible = false

    this.time = this.experience.time
    this.camera = this.experience.world.cameraOnPath.camera

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))

    this.setGeometry()
    this.setMaterials()
    this.setMesh()
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    const name = this.settings.name
    const imageObj = (state as { images: { [name: string]: { hover: boolean } } }).images[name]
    const prevImageObj = (prevState as { images: { [name: string]: { hover: boolean } } }).images[
      name
    ]
    if (!imageObj || !prevImageObj) return

    const hover = imageObj.hover
    const prevHover = prevImageObj.hover

    if (hover && hover !== prevHover) {
      gsap.killTweensOf(this.material.uniforms.uAlpha)
      this.isVisible = true
      gsap.to(this.material.uniforms.uAlpha, { value: 1, duration: 0.3 })
    } else if (!hover && hover !== prevHover) {
      gsap.to(this.material.uniforms.uAlpha, {
        value: 0,
        duration: 0.3,
        onInterrupt: () => {
          this.isVisible = false
        },
        onComplete: () => {
          this.isVisible = false
        }
      })
    }
  }

  setGeometry() {
    const [width, height] = this.settings.sizes
    this.geometry = new THREE.PlaneGeometry(width / 10, height / 10, 12, 12)
  }

  setMaterials() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: this.resources.items[this.settings.name] },
        uAlpha: { value: 0.0 },
        uOffset: { value: new THREE.Vector2(0.0, 0.0) }
      }
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = -0.5
    this.camera.add(this.mesh)
  }

  resize() {
    //
  }

  update() {
    this.cursorOffset.x = lerp(this.cursorOffset.x, window.cursor.x, 0.1)
    this.cursorOffset.y = lerp(this.cursorOffset.y, window.cursor.y, 0.1)

    if (!this.isVisible) return

    const offset = {
      x: (window.cursor.x - this.cursorOffset.x) * 0.0002,
      y: (window.cursor.y - this.cursorOffset.y) * -0.0002
    }

    //
    this.material.uniforms.uOffset.value.set(offset.x, offset.y)
    this.mesh.position.set(window.cursorNormalized.x * 0.5, window.cursorNormalized.y * -0.5, -0.5)
  }
}
