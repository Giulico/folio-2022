// Types
import type { RootState } from 'store'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import StoreWatcher from '../utils/StoreWatcher'

// Components
import Experience from '../Experience'

// Settings
import { showOrbitControls, showCameraPath } from 'settings'

export default class CameraOnPath {
  experience: Experience
  scene: Experience['scene']
  sizes: Experience['sizes']
  renderer: Experience['renderer']
  appReady: RootState['app']['ready']
  points: [number, number, number][]
  vertices!: THREE.Vector3[]
  camera!: THREE.PerspectiveCamera
  cameraHelper!: THREE.CameraHelper
  curvePath!: THREE.CatmullRomCurve3
  percentage: number
  bodyHeight?: number
  menuOpen: boolean
  snapshot: {
    lookAt: THREE.Vector3
    position: THREE.Vector3
  }
  lookAt: {
    [key: string]: THREE.Vector3
  }

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.renderer = this.experience.renderer

    this.menuOpen = false
    this.snapshot = {
      lookAt: new THREE.Vector3(),
      position: new THREE.Vector3()
    }
    this.appReady = false

    // How to retrive the points from Blender
    // from the python console:
    // filename = "/Users/giulio/Desktop/Personal data/Portfolio 2022/Blender script/export_curve_points.py"
    // exec(compile(open(filename).read(), filename, 'exec'))
    this.points = [
      [2.250452756881714, -0.6193802356719971, 5.541167736053467],
      [2.6620843410491943, 0.11057017743587494, 5.301249980926514],
      [2.516335964202881, 0.9883434176445007, 5.428454399108887],
      [4.733654975891113, 1.1559828519821167, 5.421966552734375],
      [3.7817535400390625, -0.07272994518280029, 5.208369731903076],
      [2.1067583560943604, -0.5117961764335632, 5.110057830810547],
      [0.6217780113220215, -0.49705809354782104, 4.89720344543457],
      [0.13143301010131836, 0.1222834587097168, 4.743571758270264],
      [0.5761919021606445, -0.29803839325904846, 4.895688533782959],
      [1.8171645402908325, -0.40591803193092346, 5.022176742553711]
    ]
    this.vertices = []
    this.lookAt = {
      current: new THREE.Vector3(0, 3.2, 0),
      body: new THREE.Vector3(0, 3, 0),
      portfolio: new THREE.Vector3(0, 2.7, 0),
      about: new THREE.Vector3(0, 3, 0.5),
      menu: new THREE.Vector3(2, 2, -1)
    }
    this.percentage = 0

    this.setCamera()
    this.setPath()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    // App ready
    if (state.app.ready !== prevState.app.ready) {
      this.appReady = state.app.ready

      const index = this.vertices.length - 1
      gsap.to(this.camera.position, {
        x: this.vertices[index].x,
        y: this.vertices[index].y,
        z: this.vertices[index].z,
        duration: 3.5,
        delay: 1,
        ease: 'power4.out'
      })

      gsap.to(this.lookAt.current, {
        y: this.lookAt.body.y,
        duration: 3.5,
        delay: 1,
        ease: 'power4.out'
      })
    }

    // Scroll / bodyHeight
    if (state.scroll !== prevState.scroll) {
      this.bodyHeight = window.document.body.clientHeight - this.sizes.height
    }

    // Menu
    if (state.menu.open !== prevState.menu.open) {
      if (state.menu.open) {
        this.snapshot = {
          position: this.camera.position.clone(),
          lookAt: this.lookAt.current.clone()
        }
        this.menuOpen = true

        gsap.to(this.camera.position, {
          x: 6,
          y: 5,
          z: 6,
          duration: 3,
          ease: 'power4.out'
        })
        gsap.to(this.lookAt.current, {
          x: this.lookAt.menu.x,
          y: this.lookAt.menu.y,
          z: this.lookAt.menu.z,
          duration: 3,
          ease: 'power4.out'
        })
      } else {
        gsap.to(this.camera.position, {
          x: this.snapshot.position.x,
          y: this.snapshot.position.y,
          z: this.snapshot.position.z,
          duration: 1.5,
          ease: 'power4.out',
          onComplete: () => {
            this.menuOpen = false
          }
        })
        gsap.to(this.lookAt.current, {
          x: this.snapshot.lookAt.x,
          y: this.snapshot.lookAt.y,
          z: this.snapshot.lookAt.z,
          duration: 3,
          ease: 'power4.out'
        })
      }
    }

    // Section
    if (state.section.current !== prevState.section.current) {
      switch (state.section.current) {
        case 'about':
          gsap.to(this.lookAt.current, {
            y: this.lookAt.about.y,
            z: this.lookAt.about.z,
            duration: 2,
            ease: 'power2.inOut'
          })
          break
        case 'portfolio':
          gsap.to(this.lookAt.current, {
            y: this.lookAt.portfolio.y,
            duration: 2,
            ease: 'power2.inOut'
          })
          break
        default:
          gsap.to(this.lookAt.current, {
            y: this.lookAt.body.y,
            z: this.lookAt.body.z,
            duration: 2,
            ease: 'power2.inOut'
          })
          break
      }
    }
  }

  setCamera() {
    const { width, height } = this.sizes
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10)
    // Set the camera in front of the face of the man
    this.camera.position.set(0, 3.4, 0.3)
    this.camera.lookAt(this.lookAt.current)
    this.camera.updateProjectionMatrix()
    this.scene.add(this.camera)

    if (showOrbitControls) {
      this.cameraHelper = new THREE.CameraHelper(this.camera)
      this.scene.add(this.cameraHelper)
    }
  }

  setPath() {
    // Convert the array of points into vertices
    // (in Blender the z axis is UP so we swap the z and y)
    for (let i = 0; i < this.points.length; i++) {
      const x = this.points[i][0] - 1.5
      const y = this.points[i][1] - 1.2
      const z = this.points[i][2] - 2.5 // Altezza

      this.vertices[i] = new THREE.Vector3(x, z, -y)
    }

    // Create a path from the points
    this.curvePath = new THREE.CatmullRomCurve3(this.vertices)
    const radius = 0.1
    const geometry = new THREE.TubeGeometry(this.curvePath, 50, radius, 10, false)

    const material = new THREE.MeshBasicMaterial({
      wireframe: showCameraPath,
      visible: showCameraPath,
      transparent: true,
      opacity: showCameraPath ? 1.0 : 0.0
    })

    const tube = new THREE.Mesh(geometry, material)
    this.scene.add(tube)
  }

  update() {
    if (!this.appReady) return

    this.camera.updateProjectionMatrix()

    // Always look the current position
    this.camera.lookAt(this.lookAt.current)

    // when store.scroll = true follow the scroll position
    if (this.bodyHeight && !this.menuOpen) {
      this.percentage = 1 - window.scrollY / this.bodyHeight
      const p1 = this.curvePath.getPointAt(this.percentage)

      gsap.to(this.camera.position, {
        x: p1.x + window.cursor.x * 0.2,
        y: p1.y + window.cursor.y * 0.2,
        z: p1.z,
        duration: 0.2
      })
    }

    // Camera Helper
    if (showOrbitControls) {
      this.cameraHelper.update()
    }
  }

  resize() {
    this.bodyHeight = window.document.body.clientHeight - this.sizes.height

    const { width, height } = this.sizes
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }
}
