import * as THREE from 'three'

// Types
import type { GUI } from 'lil-gui'

// Components
import Experience from '../Experience'

// Shaders
import fragmentShader from './shaders/loader/fragment'
import vertexShader from './shaders/loader/vertex'

type DebugObject = {
  color: THREE.Color
}

export default class Clouds {
  experience: Experience
  scene: Experience['scene']
  debug: Experience['debug']
  time: Experience['time']
  sizes: Experience['sizes']
  debugFolder: GUI | undefined
  debugObject: DebugObject

  geometry!: THREE.PlaneGeometry
  material!: THREE.ShaderMaterial
  mesh!: THREE.Mesh
  camera: THREE.PerspectiveCamera
  depth: number

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.camera = this.experience.world.cameraOnPath.camera
    this.sizes = this.experience.sizes
    this.depth = -10

    this.debug = this.experience.debug

    if (this.debug.active && this.debug.ui) {
      this.debugFolder = this.debug.ui.addFolder('Clouds').close()
    }

    this.debugObject = {
      color: new THREE.Color(0xff0000)
    }

    this.createGeometry()
    this.createMaterial()
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1)
  }

  createMaterial() {
    const { screenWidth, screenHeight } = this.getScreenSizes()

    this.material = new THREE.ShaderMaterial({
      // color: this.debugObject.color,
      fragmentShader,
      vertexShader,
      uniforms: {
        iTime: { value: this.time.clockElapsed },
        iResolution: {
          value: new THREE.Vector3(this.sizes.width, this.sizes.height, window.devicePixelRatio)
        },
        iAlpha: { value: 0.2 },
        iLight: { value: 0.4 },
        scale: { value: 1.2 },
        speed: { value: 0.15 }
      }
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = this.depth

    this.mesh.scale.set(Math.ceil(screenWidth), Math.ceil(screenHeight), 1)
    // this.mesh.layers.enable(1)

    this.camera.add(this.mesh)

    // if (this.debug.active && this.debugFolder) {
    //   this.debugFolder.addColor(this.debugObject, 'color').onChange((v: DebugObject['color']) => {
    //     // this.material.color = this.debugObject.color
    //   })
    // }
  }

  getScreenSizes(): { screenWidth: number; screenHeight: number } {
    // Find out the width of a rendered portion of the scene
    // https://stackoverflow.com/a/13351534/2150128
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov) // convert vertical fov to radians
    const screenHeight = 2 * Math.tan(vFOV / 2) * Math.abs(this.depth) // visible height
    const screenWidth = screenHeight * this.camera.aspect // visible width
    return { screenWidth, screenHeight }
  }

  resize() {
    const { screenWidth, screenHeight } = this.getScreenSizes()
    this.mesh.scale.set(screenWidth, screenHeight, 1)
  }

  update() {
    // update
    // console.log(this.time.clockElapsed)
    this.material.uniforms.iTime.value = this.time.clockElapsed
  }
}
