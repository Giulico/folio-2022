// Types
import type { GUI } from 'lil-gui'
import type { RootState } from 'store'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import lerp from 'utils/lerp'
import { scaleValue } from 'utils/math'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { rootNavigate } from 'components/CustomRouter'
import {
  ClickableMesh,
  StateMaterialSet,
  MouseEventManager,
  ThreeMouseEventType
} from '@masatomakino/threejs-interactive-object'
import StoreWatcher from '../utils/StoreWatcher'

// Shaders
import vertexShader from './shaders/portfolio/vertex'
import fragmentShader from './shaders/portfolio/fragment'

// Components
import Experience from '../Experience'

type DebugObject = {
  offsetX: number
  offsetY: number
  offsetZ: number
  iColorOuter: THREE.Color
  iColorInner: THREE.Color
}

type Project = {
  name: string
  video: HTMLVideoElement
}

export default class Portfolio {
  experience: Experience
  scene: Experience['scene']
  world: Experience['world']
  resources: Experience['resources']
  debug: Experience['debug']
  time: Experience['time']
  sizes: Experience['sizes']
  debugFolder: GUI | undefined
  group!: THREE.Group
  groupPosition!: THREE.Vector3
  items!: THREE.Mesh[]
  debugObject: DebugObject
  material!: StateMaterialSet
  camera: THREE.PerspectiveCamera
  manager: MouseEventManager | undefined
  projects: Project[]
  scrollBoundaries: [number, number]
  xPosition: number
  scrollOffset: number
  isVisible: boolean
  visibleItemIndex: number

  constructor() {
    this.isVisible = false
    this.scrollBoundaries = [0, 0]
    this.xPosition = 0
    this.scrollOffset = 0
    this.visibleItemIndex = 0

    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.world = this.experience.world
    this.sizes = this.experience.sizes

    this.time = this.experience.time

    this.camera = this.experience.world.cameraOnPath.camera
    if (this.camera && this.experience.renderer.canvas) {
      this.manager = new MouseEventManager(this.scene, this.camera, this.experience.renderer.canvas)
    }

    this.projects = [
      {
        name: 'sketchin',
        video: document.getElementById('skReel') as HTMLVideoElement
      },
      {
        name: 'aquest',
        video: document.getElementById('aqReel') as HTMLVideoElement
      },
      {
        name: 'fastweb',
        video: document.getElementById('fbReel') as HTMLVideoElement
      },
      {
        name: 'feudi',
        video: document.getElementById('feudiReel') as HTMLVideoElement
      },
      {
        name: 'claraluna',
        video: document.getElementById('claralunaReel') as HTMLVideoElement
      }
    ]

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Portfolio').close()
    }

    this.debugObject = {
      offsetX: 2.2,
      offsetY: -0.039,
      offsetZ: -1,
      iColorOuter: new THREE.Color(0x426ff5),
      iColorInner: new THREE.Color(0xc9ddf2)
    }

    this.setItems()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    const currentSection = state.section.current
    const prevSection = prevState.section.current

    if (state.section.boundaries !== prevState.section.boundaries) {
      const portfolioBoundaries = state.section.boundaries.find((b) => b.name === 'portfolio')
      if (portfolioBoundaries) {
        this.scrollBoundaries = [
          portfolioBoundaries.start,
          portfolioBoundaries.end - this.sizes.height
        ]
      }
    }

    // Section
    if (currentSection !== prevSection && currentSection === 'portfolio') {
      this.enterAnimation()
    }

    if (currentSection !== prevSection && prevSection === 'portfolio') {
      this.leaveAnimation()
    }
  }

  setItems() {
    this.group = new THREE.Group()
    this.group.name = 'portfolio'

    // Set the group in front of the camera
    const { offsetX, offsetY, offsetZ } = this.debugObject
    this.group.position.set(offsetX, offsetY, offsetZ)

    this.items = []

    for (let i = 0; i < this.projects.length; i++) {
      // Geometry
      const geometry = new THREE.PlaneGeometry(0.7, 0.5, 24, 24)

      // Play video
      const { video, name } = this.projects[i]
      video.play()

      const uniforms = {
        iFactor: { value: 2 },
        iChannel0: { value: new THREE.VideoTexture(video) },
        iChannel1: { value: this.resources.items.noise },
        iColorOuter: { value: this.debugObject.iColorOuter },
        iColorInner: { value: this.debugObject.iColorInner },
        iOffset: { value: new THREE.Vector2(0.01, 0.01) }
      }

      // Material
      const material = new StateMaterialSet({
        normal: new THREE.ShaderMaterial({
          transparent: true,
          uniforms,
          vertexShader,
          fragmentShader
        })
      })

      const clickablMesh = new ClickableMesh({
        geo: geometry,
        material
      })
      clickablMesh.castShadow = false
      clickablMesh.receiveShadow = false
      clickablMesh.name = name
      clickablMesh.position.set(i * 1.1, 0, 0)

      clickablMesh.addEventListener(ThreeMouseEventType.CLICK, (e) => {
        if (!this.isVisible) return
        rootNavigate(e.model.view.name)
      })
      clickablMesh.addEventListener(ThreeMouseEventType.OVER, (e) => {
        if (!this.isVisible) return
        window.store.dispatch.pointer.setLabel(e.model.view.name)
      })
      clickablMesh.addEventListener(ThreeMouseEventType.OUT, () => {
        if (!this.isVisible) return
        window.store.dispatch.pointer.setLabel('')
      })

      this.group.add(clickablMesh)
      this.items[i] = clickablMesh
    }

    this.camera.add(this.group)

    // Debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, 'offsetY')
        .min(-5)
        .max(5)
        .step(0.001)
        .onChange(() => {
          this.group.position.y = this.debugObject.offsetY
        })
      this.debugFolder
        .add(this.debugObject, 'offsetZ')
        .min(-5)
        .max(5)
        .step(0.001)
        .onChange(() => {
          this.group.position.z = this.debugObject.offsetZ
        })
      this.debugFolder.addColor(this.debugObject, 'iColorOuter').onChange((v: string) => {
        for (const item of this.items) {
          // @ts-ignore
          item.material.uniforms.iColorOuter.value = new THREE.Color(v)
        }
      })
      this.debugFolder.addColor(this.debugObject, 'iColorInner').onChange((v: string) => {
        for (const item of this.items) {
          // @ts-ignore
          item.material.uniforms.iColorInner.value = new THREE.Color(v)
        }
      })
    }
  }

  enterAnimation() {
    this.isVisible = true
    window.addEventListener('scroll', this.scrollHandler)
  }

  revealItem(index: number) {
    if (!this.items[index]) return

    // @ts-ignore
    gsap.to(this.items[index].material.uniforms.iFactor, {
      value: 3.2,
      duration: 3,
      ease: 'power3.out'
    })
  }

  restoreItems() {
    for (const item of this.items) {
      // @ts-ignore
      gsap.killTweensOf(item.material.uniforms.iFactor, 'value')
      // @ts-ignore
      gsap.set(item.material.uniforms.iFactor, { value: 2 })
    }
  }

  scrollHandler = () => {
    this.xPosition = scaleValue(window.scrollY, this.scrollBoundaries, [
      this.debugObject.offsetX,
      -this.projects.length - 1
    ])
    if (Math.abs(this.xPosition - 0.2) !== this.visibleItemIndex) {
      const itemIndex = Math.floor(Math.abs(this.xPosition - 0.2))
      this.revealItem(itemIndex)
      this.visibleItemIndex = itemIndex
    }
  }

  leaveAnimation() {
    this.isVisible = false
    this.restoreItems()
    window.removeEventListener('scroll', this.scrollHandler)
  }

  openProjectAnimation() {
    // Get the project name and its card
    const location = window.comingLocation
    const projectName = location.pathname.split('/')[1]

    const item = this.items.find((item) => item.name === projectName)
    if (!item) throw new Error('Project not found')

    // Disable scroll
    disablePageScroll()

    // move object to scene without changing it's world orientation
    // restored in closeProjectAnimation
    this.scene.attach(item)

    this.camera.updateMatrixWorld()

    const distanceFromCamera = 0.5
    const target = new THREE.Vector3(0, 0, -distanceFromCamera)
    target.applyMatrix4(this.camera.matrixWorld)

    // Position
    gsap.to(item.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1,
      ease: 'power4.in'
    })

    // Transition
    gsap.to(item.rotation, {
      x: this.camera.rotation.x,
      y: this.camera.rotation.y,
      z: this.camera.rotation.z,
      duration: 1,
      ease: 'power4.in'
    })
  }

  closeProjectAnimation() {
    const name = window.currentLocation.pathname.split('/')[1]

    const index = this.items.findIndex((item) => item.name === name)
    const item = this.items[index]
    if (!item) throw new Error('Project not found')

    // move object to parent without changing it's world orientation
    this.group.attach(item)

    this.camera.updateMatrixWorld()

    // Position
    gsap.to(item.position, {
      x: index * 1.1,
      y: 0,
      z: 0,
      delay: 0.7,
      ease: 'power4.inOut',
      duration: 1.4
    })

    // Transition
    gsap.to(item.rotation, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.7,
      ease: 'power4.inOut',
      duration: 1.4,
      onComplete: () => {
        // Enable scroll
        enablePageScroll()
      }
    })
  }

  update() {
    if (!this.isVisible) return
    const scrollY = window.scrollY
    this.scrollOffset = lerp(this.scrollOffset, scrollY, 0.1)
    const offset = (scrollY - this.scrollOffset) * 0.0002
    // Update iOffset
    for (const item of this.items) {
      ;(item.material as THREE.ShaderMaterial).uniforms.iOffset.value.set(-offset, 0.0)
    }

    // Set the group in front of the camera
    // this.updateGroupPosition()

    gsap.to(this.group.position, {
      x: this.xPosition,
      // y: this.groupPosition.y,
      // z: this.groupPosition.z,
      duration: 2
    })
    // gsap.to(this.group.rotation, {
    //   x: this.camera.rotation.x,
    //   y: this.camera.rotation.y,
    //   z: this.camera.rotation.z,
    //   duration: 2
    // })
  }
}
