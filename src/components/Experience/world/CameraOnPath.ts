// Types
import type { RootState } from 'store'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import StoreWatcher from '../utils/StoreWatcher'

// Components
import Experience from '../Experience'

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
  lookAt: {
    [key: string]: THREE.Vector3
  }

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.renderer = this.experience.renderer

    this.appReady = false

    // How to retrive the points from Blender
    // from the python console:
    // filename = "/Users/giulio/Desktop/Personal data/Portfolio 2022/Blender script/export_curve_points.py"
    // exec(compile(open(filename).read(), filename, 'exec'))
    this.points = [
      [0.4926736354827881, -1.2741336822509766, 5.7993903160095215],
      [6.481095314025879, -1.1794805526733398, 4.355730056762695],
      [5.979461193084717, -2.4142465591430664, 4.092484951019287],
      [4.6285905838012695, -3.106524705886841, 3.785893201828003],
      [2.370417833328247, -3.4643492698669434, 3.6577494144439697],
      [0.8954894542694092, -3.49639892578125, 3.643882989883423],
      [0.899259090423584, -3.495410919189453, 3.6446266174316406],
      [0.8954894542694092, -3.49639892578125, 3.643882989883423],
      [0.8993373513221741, -3.4954590797424316, 3.6446948051452637],
      [0.8954894542694092, -3.49639892578125, 3.643882989883423],
      [-1.0636134147644043, -2.9119200706481934, 3.7828736305236816],
      [-2.043549060821533, -1.7312498092651367, 3.946715831756592],
      [-1.403911828994751, -0.2910417914390564, 4.682248592376709],
      [1.4550237655639648, -1.9338868856430054, 4.648040294647217],
      [1.7000510692596436, -1.6848936080932617, 4.73479700088501]
    ]
    this.vertices = []
    this.lookAt = {
      current: new THREE.Vector3(0, 3.4, 0),
      head: new THREE.Vector3(0, 3.4, 0),
      body: new THREE.Vector3(0, 3, 0),
      chest: new THREE.Vector3(0, 2, 0),
      behind: new THREE.Vector3(0, 4, -20)
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

    // Section
    if (state.section.current !== prevState.section.current) {
      switch (state.section.current) {
        case 'hero':
        case 'about':
          gsap.to(this.lookAt.current, {
            y: this.lookAt.body.y,
            duration: 1,
            ease: 'power3.inOut'
          })
          break
        case 'portfolio':
          gsap.to(this.lookAt.current, {
            y: this.lookAt.chest.y,
            duration: 1,
            ease: 'power3.inOut'
          })
          break
        default:
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

    if (this.renderer.debugObject.orbitControls) {
      this.cameraHelper = new THREE.CameraHelper(this.camera)
      this.scene.add(this.cameraHelper)
    }
  }

  setPath() {
    // Convert the array of points into vertices
    // (in Blender the z axis is UP so we swap the z and y)
    for (let i = 0; i < this.points.length; i++) {
      const x = this.points[i][0] - 2
      const y = this.points[i][1]
      const z = this.points[i][2] - 2

      this.vertices[i] = new THREE.Vector3(x, z, -y)
    }

    // Create a path from the points
    this.curvePath = new THREE.CatmullRomCurve3(this.vertices)
    const radius = 0.1
    const geometry = new THREE.TubeGeometry(this.curvePath, 50, radius, 10, false)

    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.0
    })

    const tube = new THREE.Mesh(geometry, material)
    this.scene.add(tube)
  }

  update() {
    if (!this.appReady) return

    // Always look the current position
    this.camera.lookAt(this.lookAt.current)

    // when store.scroll = true follow the scroll position
    if (this.bodyHeight) {
      this.percentage = 1 - window.scrollY / this.bodyHeight
      const p1 = this.curvePath.getPointAt(this.percentage)

      gsap.to(this.camera.position, {
        x: p1.x + window.cursor.x * 0.2,
        y: p1.y + window.cursor.y * 0.2,
        z: p1.z,
        duration: 0.3
      })
    }

    // Camera Helper
    if (this.renderer.debugObject.orbitControls) {
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
