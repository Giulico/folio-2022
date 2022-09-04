// Types
import type { GUI } from 'lil-gui'
import type { RootState } from 'store'

// Fonts
import fnt from '/fonts/MSDF/SairaSemiCondensed-SemiBold-msdf.json?url'
import png from '/fonts/MSDF/SairaSemiCondensed-SemiBold.png?url'

// Shaders
import vertexShader from './shaders/title/vertex'
import fragmentShader from './shaders/title/fragment'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import { MSDFTextGeometry, uniforms } from '../utils/MSDFText'
import { scaleValue } from 'utils/math'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import StoreWatcher from '../utils/StoreWatcher'
import breakpoints from 'utils/breakpoints'

// Components
import Experience from '../Experience'

type DebugObject = {
  offsetY: number
  progress1: number
  progress2: number
  progress3: number
  progress4: number
  progress5: number
  enterFromLeft: () => void
  enterFromTop: () => void
  enterFromBottom: () => void
  leaveToTop: () => void
  leaveToBottom: () => void
  reset: () => void
}

type Settings = {
  itemIndex: number
  text: string
}

export default class Title {
  settings: Settings
  experience: Experience
  scene: Experience['scene']
  sizes: Experience['sizes']
  debug: Experience['debug']
  camera: Experience['world']['cameraOnPath']['camera']
  material!: THREE.ShaderMaterial
  mesh!: THREE.Mesh
  scale!: number
  debugFolder: GUI | undefined
  debugObject: DebugObject
  yTop: number
  yBottom: number
  _pageYPosition: number
  isVisible: boolean

  constructor(options: Settings) {
    this.settings = options

    this.experience = new Experience()
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.camera = this.experience.world.cameraOnPath.camera
    this.isVisible = false

    this.yTop = 2
    this.yBottom = -3
    this._pageYPosition = Infinity

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder(`Title ${this.settings.text}`).close()
    }

    this.debugObject = {
      offsetY: 1.02,
      progress1: 0,
      progress2: 0,
      progress3: 0,
      progress4: 0,
      progress5: 0,
      enterFromLeft: this.enterFromLeft.bind(this),
      enterFromTop: this.enterFromTop.bind(this),
      enterFromBottom: this.enterFromBottom.bind(this),
      leaveToTop: this.leaveToTop.bind(this),
      leaveToBottom: this.leaveToBottom.bind(this),
      reset: this.reset.bind(this)
    }

    // Scroll listener
    window.addEventListener('scroll', this.positionItem.bind(this))
    // Store change listener
    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))

    this.setScale()

    this.setTitle().then(() => {
      // Todo remove autoplay
      setTimeout(() => {
        this.positionItem()
        this.enterFromLeft()
      }, 1500)
    })
  }

  set pageYPosition(v: number) {
    this._pageYPosition = v
    this.positionItem()
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    const index = state.menu.index
    const prevIndex = prevState.menu.index
    const itemIndex = this.settings.itemIndex

    if (index !== prevIndex) {
      if (index === itemIndex && prevIndex < itemIndex) {
        this.enterFromTop()
      }
      if (index === itemIndex && prevIndex > itemIndex) {
        this.enterFromBottom()
      }
      if (index < itemIndex && prevIndex === itemIndex) {
        this.leaveToTop()
      }
      if (index > itemIndex && prevIndex === itemIndex) {
        this.leaveToBottom()
      }
    }

    const width = state.sizes.width
    const prevWidth = prevState.sizes.width
    if (width !== prevWidth) {
      this.setScale()
      this.positionItem()
    }
  }

  setScale() {
    // Mobile
    this.scale = 0.012

    if (this.sizes.width >= breakpoints.mdL) {
      this.scale = 0.03
    }
  }

  menuOpen(itemIndex: number) {
    gsap.to(this.mesh.scale, {
      x: this.scale / 2,
      y: this.scale / 2,
      duration: 0.3,
      ease: 'expo.inOut'
    })

    // Mobile
    let offsetTop = 0.7
    let distanceBetweenItems = -0.4

    if (this.sizes.width > breakpoints.mdL) {
      offsetTop = 0.8
      distanceBetweenItems = -0.8
    }

    gsap.to(this.mesh.position, {
      y: offsetTop + distanceBetweenItems * itemIndex,
      duration: 1,
      ease: 'power3.out'
    })
  }

  menuClose() {
    const { y } = this.getPositionInfo()

    gsap.to(this.mesh.scale, {
      x: this.scale,
      y: this.scale,
      duration: 0.3,
      ease: 'expo.inOut'
    })
    gsap.to(this.mesh.position, {
      y,
      duration: 1,
      ease: 'expo.inOut'
    })
  }

  enterFromLeft() {
    if (!this.material /* || !this.isVisible */) return
    const d = 4.0
    const s = 0.2
    const tl = gsap.timeline()
    const ease = 'expo.out'
    tl.to(this.material.uniforms.uProgress1, {
      value: 1,
      duration: d,
      ease
    })
    tl.to(
      this.material.uniforms.uProgress2,
      {
        value: 1,
        duration: d,
        ease
      },
      s
    )
    tl.to(
      this.material.uniforms.uProgress3,
      {
        value: 1,
        duration: d,
        ease
      },
      s * 2
    )
    tl.to(
      this.material.uniforms.uProgress4,
      {
        value: 1,
        duration: d,
        ease
      },
      s * 3
    )
  }

  enterFromTop() {
    if (!this.material) return
    const d = 2.0
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 0
    gsap.to(this.material.uniforms.uProgress5, {
      value: 1,
      duration: d,
      ease
    })
  }

  enterFromBottom() {
    if (!this.material) return
    const d = 2.0
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 1
    gsap.to(this.material.uniforms.uProgress5, {
      value: 1,
      duration: d,
      ease
    })
  }

  leaveToTop() {
    if (!this.material) return
    const d = 2.0
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 0
    gsap.to(this.material.uniforms.uProgress5, {
      value: 0,
      duration: d,
      ease
    })
  }

  leaveToBottom() {
    if (!this.material) return
    const d = 2.0
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 1
    gsap.to(this.material.uniforms.uProgress5, {
      value: 0,
      duration: d,
      ease
    })
  }

  reset() {
    if (!this.material) return
    gsap.killTweensOf(this.material.uniforms.uProgress1, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress2, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress3, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress4, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress5, 'value')
    this.material.uniforms.uProgress1.value = 0.0
    this.material.uniforms.uProgress2.value = 0.0
    this.material.uniforms.uProgress3.value = 0.0
    this.material.uniforms.uProgress4.value = 0.0
    this.material.uniforms.uProgress5.value = 0.0
  }

  positionItem() {
    if (!this.mesh) return

    const { y, position } = this.getPositionInfo()
    this.mesh.position.y = y

    // Find out the width of a rendered portion of the scene
    // https://stackoverflow.com/a/13351534/2150128
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov) // convert vertical fov to radians
    const dist = -1
    const height = 2 * Math.tan(vFOV / 2) * dist // visible height
    const width = height * this.camera.aspect // visible width
    this.mesh.position.x = width

    // item is in viewport
    if (position === 'inview') {
      if (!this.isVisible) {
        this.isVisible = true
        this.reset()
        this.enterFromLeft()
      }
    } else {
      if (this.isVisible) {
        this.isVisible = false
      }
    }
  }

  getPositionInfo() {
    const scrollY = window.scrollY
    const height = this.sizes.height
    const scrollStart = this._pageYPosition
    const scrollEnd = this._pageYPosition + height

    // item is in viewport
    if (scrollY + height >= scrollStart && scrollY < scrollEnd) {
      const y = scaleValue(scrollY, [scrollStart - height, scrollEnd], [this.yBottom, this.yTop])
      return {
        y: y + this.debugObject.offsetY,
        position: 'inview'
      }
    } else if (scrollY + height < scrollEnd) {
      return {
        y: this.yBottom,
        position: 'before'
      }
    } else {
      return {
        y: this.yTop,
        position: 'after'
      }
    }
  }

  async setTitle() {
    const promises = [this.loadFontAtlas(png), this.loadFont(fnt)]

    return Promise.all(promises).then(([atlas, fnt]) => {
      const font = (fnt as { data: any }).data
      const geometry = new MSDFTextGeometry({
        text: this.settings.text,
        font
      })

      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        defines: {
          IS_SMALL: false
        },
        extensions: {
          derivatives: true
        },
        uniforms: {
          // Common
          ...uniforms.common,

          // Rendering
          ...uniforms.rendering,

          // Strokes
          ...uniforms.strokes,

          uStrokeOutsetWidth: { value: 0.1 },
          uStrokeInsetWidth: { value: 0.0 },
          uProgress1: { value: 0 },
          uProgress2: { value: 0 },
          uProgress3: { value: 0 },
          uProgress4: { value: 0 },
          uProgress5: { value: 0 },
          uDirection: { value: 1 }
        },
        vertexShader,
        fragmentShader
      })
      this.material.uniforms.uMap.value = atlas

      this.mesh = new THREE.Mesh(geometry, this.material)
      this.mesh.rotation.x = Math.PI
      this.mesh.scale.set(this.scale, this.scale, this.scale)

      // this.mesh.position.x = -1.8
      this.mesh.position.z = -4.5

      this.camera.add(this.mesh)

      // Debug
      if (this.debug.active && this.debugFolder) {
        this.debugFolder
          .add(this.debugObject, 'offsetY')
          .min(-2)
          .max(2)
          .step(0.001)
          .onChange(() => {
            this.positionItem()
          })
        this.debugFolder.add(this.debugObject, 'enterFromLeft')
        this.debugFolder.add(this.debugObject, 'enterFromTop')
        this.debugFolder.add(this.debugObject, 'enterFromBottom')
        this.debugFolder.add(this.debugObject, 'leaveToTop')
        this.debugFolder.add(this.debugObject, 'leaveToBottom')
        this.debugFolder.add(this.debugObject, 'reset')
        this.debugFolder
          .add(this.debugObject, 'progress1')
          .min(0)
          .max(1)
          .step(0.01)
          .onChange(() => {
            this.material.uniforms.uProgress1.value = this.debugObject.progress1
          })
        this.debugFolder
          .add(this.debugObject, 'progress2')
          .min(0)
          .max(1)
          .step(0.01)
          .onChange(() => {
            this.material.uniforms.uProgress2.value = this.debugObject.progress2
          })
        this.debugFolder
          .add(this.debugObject, 'progress3')
          .min(0)
          .max(1)
          .step(0.01)
          .onChange(() => {
            this.material.uniforms.uProgress3.value = this.debugObject.progress3
          })
        this.debugFolder
          .add(this.debugObject, 'progress4')
          .min(0)
          .max(1)
          .step(0.01)
          .onChange(() => {
            this.material.uniforms.uProgress4.value = this.debugObject.progress4
          })
        this.debugFolder
          .add(this.debugObject, 'progress5')
          .min(0)
          .max(1)
          .step(0.01)
          .onChange(() => {
            this.material.uniforms.uProgress5.value = this.debugObject.progress5
          })
      }
    })
  }

  loadFontAtlas(path: string) {
    const promise = new Promise((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.load(path, resolve)
    })

    return promise
  }

  loadFont(path: string) {
    const promise = new Promise((resolve) => {
      const loader = new FontLoader()
      loader.load(path, resolve)
    })

    return promise
  }

  update() {
    // Animations
  }
}
