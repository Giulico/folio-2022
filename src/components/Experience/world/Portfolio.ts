// Types
import type { GUI } from 'lil-gui'
import type { LoadResult } from '../utils/Resources'
import type { RootState } from 'store'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { rootNavigate } from 'components/CustomRouter'
import {
  ClickableMesh,
  StateMaterialSet,
  MouseEventManager,
  ThreeMouseEventType
} from '@masatomakino/threejs-interactive-object'
import StoreWatcher from '../utils/StoreWatcher'

// Components
import Experience from '../Experience'

type DebugObject = {
  offsetX: number
  offsetY: number
  offsetZ: number
  pageHeightFactor: number
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
  sizes: Experience['sizes']
  time: Experience['time']
  resource: LoadResult
  renderer: Experience['renderer']['instance']
  debugFolder: GUI | undefined
  group!: THREE.Group
  items!: THREE.Mesh[]
  debugObject: DebugObject
  material!: StateMaterialSet
  camera: THREE.PerspectiveCamera
  manager: MouseEventManager | undefined
  itemsXPosition: number[] = []
  projects: Project[]

  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.world = this.experience.world

    this.resources = this.experience.resources
    this.resource = this.resources.items.manModel
    this.time = this.experience.time
    this.renderer = this.experience.renderer.instance

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
      this.debugFolder = this.debug.ui?.addFolder('Portfolio')
    }

    this.debugObject = {
      offsetX: 1.0,
      offsetY: 2.7,
      offsetZ: 0.8,
      pageHeightFactor: 2.1
    }

    this.setItems()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    const currentSection = state.section.current
    const prevSection = prevState.section.current

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

    const videoAQ = document.getElementById('aqReel') as HTMLVideoElement
    videoAQ.play()

    this.items = []

    const { offsetX, offsetY, offsetZ } = this.debugObject

    const zRound = [-0.5, 0.0, 0.25, 0.0, -0.5]
    for (let i = 0; i < this.projects.length; i++) {
      // Geometry
      const geometry = new THREE.PlaneGeometry(1, 0.7, 24, 24)

      // Play video
      const { video, name } = this.projects[i]
      video.play()

      // Material
      const material = new StateMaterialSet({
        normal: new THREE.MeshBasicMaterial({
          color: 0x333333,
          map: new THREE.VideoTexture(video)
        })
      })

      const clickablMesh = new ClickableMesh({
        geo: geometry,
        material
      })
      clickablMesh.name = name
      clickablMesh.visible = false
      clickablMesh.position.set(i * 1.3 + offsetX, offsetY, offsetZ)
      clickablMesh.position.z += zRound[i]
      clickablMesh.rotation.y = -0.5 + (Math.PI / 10) * i

      clickablMesh.addEventListener(ThreeMouseEventType.CLICK, (e) => {
        rootNavigate(e.model.view.name)
      })

      this.group.add(clickablMesh)
      this.items[i] = clickablMesh
    }

    this.group.position.x = -3
    // this.group.rotation.z = Math.PI / 15
    this.scene.add(this.group)

    // Debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder.add(this.debugObject, 'offsetX').min(-10).max(3).step(0.1)
      // .onChange((v: number) => {
      //   for (let i = 0; i < this.items.length; i++) {
      //     this.items[i].position.x = i * 2 + v;
      //   }
      // });
      this.debugFolder
        .add(this.debugObject, 'offsetY')
        .min(0)
        .max(10)
        .step(0.01)
        .onChange((v: number) => {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].position.y = v
          }
        })
      this.debugFolder
        .add(this.debugObject, 'offsetZ')
        .min(-5)
        .max(5)
        .step(0.01)
        .onChange((v: number) => {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].position.z = v
          }
        })
      this.debugFolder.add(this.debugObject, 'pageHeightFactor').min(0).max(5).step(0.1)
    }
  }

  enterAnimation() {
    // console.log('enter animation')
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      // item.visible = true
    }
  }

  leaveAnimation() {
    // console.log('leave animation')
    // const { offsetX, offsetY, offsetZ } = this.debugObject
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      //   item.position.set(i * 1.3 + offsetX, offsetY, offsetZ)
      item.visible = false
    }
  }

  openProjectAnimation() {
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

    const distanceFromCamera = 0.8
    const target = new THREE.Vector3(0, 0, -distanceFromCamera)
    target.applyMatrix4(this.camera.matrixWorld)

    // Position
    gsap.to(item.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 0.5
    })

    // Transition
    gsap.to(item.rotation, {
      x: this.camera.rotation.x,
      y: this.camera.rotation.y,
      z: this.camera.rotation.z,
      duration: 0.5
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
    const { offsetX, offsetY, offsetZ } = this.debugObject
    gsap.to(item.position, {
      x: index * 1.3 + offsetX,
      y: offsetY,
      z: offsetZ,
      duration: 0.5
    })

    // Transition
    gsap.to(item.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
      onComplete: () => {
        // Enable scroll
        enablePageScroll()
      }
    })
  }

  update() {
    // Update
  }
}
