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
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { scaleValue } from 'utils/math'
import StoreWatcher from '../utils/StoreWatcher'
import breakpoints from 'utils/breakpoints'

// Components
import Experience from '../Experience'

type DebugObject = {
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
  yTop!: number
  yBottom!: number
  yOffset!: number
  _pageYPosition: number
  isVisible: boolean
  isMenuOpen: boolean
  depth: number

  constructor(options: Settings) {
    this.settings = options

    this.experience = new Experience()
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.camera = this.experience.world.cameraOnPath.camera

    this.isVisible = false
    this.isMenuOpen = false

    this.depth = -4.5
    this._pageYPosition = Infinity

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder(`Title ${this.settings.text}`).close()
    }

    this.debugObject = {
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
        this.setYBoundaries()
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
  }

  setYBoundaries() {
    const { screenHeight } = this.getScreenSizes()
    const geometry = this.mesh.geometry as MSDFTextGeometry
    const halfTextHeight = ((geometry.layout?.height || 0) * this.scale) / 2

    this.yTop = screenHeight * 0.5 + halfTextHeight
    this.yBottom = screenHeight * -0.5 - halfTextHeight * 2

    // Find the margin top
    let marginTopPx = 105
    if (this.sizes.width >= breakpoints.lg) {
      marginTopPx = 145
    } else if (this.sizes.width >= breakpoints.mdL) {
      marginTopPx = 125
    }
    const screenTopPosition = screenHeight / 2 - halfTextHeight / 2
    const marginTop = (screenHeight * marginTopPx) / this.sizes.height
    this.yOffset = screenTopPosition - marginTop
  }

  setScale() {
    // Mobile
    this.scale = 0.012

    if (this.sizes.width >= breakpoints.mdL) {
      this.scale = 0.03
      // this.scale = 1
    }
  }

  menuOpen(itemIndex: number) {
    const { height: screenHeightPx } = this.sizes
    const { screenHeight } = this.getScreenSizes()
    const geometry = this.mesh.geometry as MSDFTextGeometry
    const textHeight = (geometry.layout?.height || 0) * this.scale
    const halfTextHeight = textHeight / 2

    this.isMenuOpen = true

    gsap.to(this.mesh.scale, {
      x: this.scale / 1.5,
      y: this.scale / 1.5,
      z: this.scale / 1.5,
      duration: 0.3,
      ease: 'expo.inOut'
    })

    // Find the margin top of the first element
    let marginTopPx = 145
    if (this.sizes.width >= breakpoints.lg) {
      marginTopPx = 195
    } else if (this.sizes.width >= breakpoints.mdL) {
      marginTopPx = 175
    }
    const screenTopPosition = screenHeight / 2 - halfTextHeight / 2
    const marginTop = (screenHeight * marginTopPx) / screenHeightPx
    const firstItemPosition = screenTopPosition - marginTop

    // Find the snaps between the items
    const circleSize = 50 // MenuTrigger index.module.css --size
    let offsetTop = 155 // MenuTrigger index.module.css --offset-top
    if (this.sizes.width >= breakpoints.lg) {
      offsetTop = 200
    }
    const verticalMargin = offsetTop * 2
    let lineHeight = this.sizes.height * 0.8 - verticalMargin
    if (this.sizes.width >= breakpoints.mdL) {
      lineHeight = this.sizes.height - verticalMargin
    }

    const sliderHeightPx = circleSize * 2 + lineHeight
    const sliderHeight = (sliderHeightPx * screenHeight) / screenHeightPx
    const itemLength = window.store.getState().section.boundaries.length
    const points = itemLength - 1
    const scale = 3 // should be 1.5, but 3 looks better. Issue with MSDFT font bounding
    const subtractor = (textHeight / scale / points) * itemIndex

    const snap = sliderHeight / points
    const currentSnap = snap * itemIndex - subtractor

    const y = firstItemPosition - currentSnap

    gsap.to(this.mesh.position, {
      y,
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
      ease: 'expo.inOut',
      onComplete: () => {
        this.isMenuOpen = false
      }
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
    const s = 0.1
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 0
    gsap.killTweensOf(this.material.uniforms.uProgress5, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress6, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress7, 'value')

    gsap.to(this.material.uniforms.uProgress5, {
      value: 1,
      duration: d,
      ease
    })
    gsap.to(this.material.uniforms.uProgress6, {
      value: 1,
      duration: d,
      delay: s,
      ease
    })
    gsap.to(this.material.uniforms.uProgress7, {
      value: 1,
      duration: d,
      delay: s * 2,
      ease
    })
  }

  enterFromBottom() {
    if (!this.material) return
    const d = 2.0
    const s = 0.1
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 1

    gsap.killTweensOf(this.material.uniforms.uProgress5, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress6, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress7, 'value')
    gsap.to(this.material.uniforms.uProgress5, {
      value: 1,
      duration: d,
      ease
    })
    gsap.to(this.material.uniforms.uProgress6, {
      value: 1,
      duration: d,
      delay: s,
      ease
    })
    gsap.to(this.material.uniforms.uProgress7, {
      value: 1,
      duration: d,
      delay: s * 2,
      ease
    })
  }

  leaveToTop() {
    if (!this.material) return
    const d = 2.0
    const s = 0.1
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 0
    gsap.killTweensOf(this.material.uniforms.uProgress5, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress6, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress7, 'value')
    gsap.to(this.material.uniforms.uProgress5, {
      value: 0,
      duration: d,
      ease
    })
    gsap.to(this.material.uniforms.uProgress6, {
      value: 0,
      duration: d,
      delay: s,
      ease
    })
    gsap.to(this.material.uniforms.uProgress7, {
      value: 0,
      duration: d,
      delay: s * 2,
      ease
    })
  }

  leaveToBottom() {
    if (!this.material) return
    const d = 2.0
    const s = 0.1
    const ease = 'expo.out'
    this.material.uniforms.uDirection.value = 1
    gsap.killTweensOf(this.material.uniforms.uProgress5, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress6, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress7, 'value')
    gsap.to(this.material.uniforms.uProgress5, {
      value: 0,
      duration: d,
      ease
    })
    gsap.to(this.material.uniforms.uProgress6, {
      value: 0,
      duration: d,
      delay: s,
      ease
    })
    gsap.to(this.material.uniforms.uProgress7, {
      value: 0,
      duration: d,
      delay: s * 2,
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
    gsap.killTweensOf(this.material.uniforms.uProgress6, 'value')
    gsap.killTweensOf(this.material.uniforms.uProgress7, 'value')
    this.material.uniforms.uProgress1.value = 0.0
    this.material.uniforms.uProgress2.value = 0.0
    this.material.uniforms.uProgress3.value = 0.0
    this.material.uniforms.uProgress4.value = 0.0
    this.material.uniforms.uProgress5.value = 0.0
    this.material.uniforms.uProgress6.value = 0.0
    this.material.uniforms.uProgress7.value = 0.0
  }

  positionItem() {
    if (!this.mesh || this.isMenuOpen) return

    const { y, position } = this.getPositionInfo()

    this.mesh.position.y = y

    const { screenWidth } = this.getScreenSizes()

    let px // spacing.css --text-margin-left

    if (this.sizes.width >= breakpoints.xl) {
      px = 450 // xl
    } else if (this.sizes.width >= breakpoints.lg) {
      px = 320 // lg
    } else if (this.sizes.width >= breakpoints.mdL) {
      px = 280 // md-l
    } else {
      px = 116 // mobile
    }

    const leftPosition = (screenWidth * px) / this.sizes.width

    // Since 0 is in the middle of the screen, subtract half width
    this.mesh.position.x = leftPosition - screenWidth / 2
    this.mesh.scale.set(this.scale, this.scale, this.scale)

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

  getScreenSizes(): { screenWidth: number; screenHeight: number } {
    // Find out the width of a rendered portion of the scene
    // https://stackoverflow.com/a/13351534/2150128
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov) // convert vertical fov to radians
    const screenHeight = 2 * Math.tan(vFOV / 2) * Math.abs(this.depth) // visible height
    const screenWidth = screenHeight * this.camera.aspect // visible width
    return { screenWidth, screenHeight }
  }

  getPositionInfo() {
    const scrollY = window.scrollY
    const height = this.sizes.height
    const scrollStart = this._pageYPosition
    const scrollEnd = this._pageYPosition + height
    // item is in viewport
    if (scrollY + height >= scrollStart && scrollY < scrollEnd) {
      // Set positions based on scroll position, then add an offset to align the text to the menu separator line
      const y =
        scaleValue(scrollY, [scrollStart - height, scrollEnd], [this.yBottom, this.yTop]) +
        this.yOffset

      return {
        y,
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
        mode: 'nowrap',
        lineHeight: 50,
        font
      })

      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
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
          uProgress6: { value: 0 },
          uProgress7: { value: 0 },
          uDirection: { value: 1 }
        },
        vertexShader,
        fragmentShader
      })
      this.material.uniforms.uMap.value = atlas

      this.mesh = new THREE.Mesh(geometry, this.material)

      this.mesh.rotation.x = Math.PI
      this.mesh.scale.set(this.scale, this.scale, this.scale)
      this.mesh.position.z = this.depth

      this.camera.add(this.mesh)

      // Debug
      if (this.debug.active && this.debugFolder) {
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
    // if (this.settings.text === 'TCMG' && this.mesh) {
    //   console.log('upda', this.mesh.position.y)
    // }
  }

  resize() {
    if (!this.mesh) return

    this.setScale()
    this.setYBoundaries()
    this.positionItem()
  }
}
