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

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.camera = this.experience.world.cameraOnPath.camera
    this.sizes = this.experience.sizes

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
    this.geometry = new THREE.PlaneGeometry(10, 5)
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      // color: this.debugObject.color,
      fragmentShader,
      vertexShader,
      uniforms: {
        iTime: { value: this.time.clockElapsed },
        iResolution: {
          value: new THREE.Vector3(this.sizes.width, this.sizes.height, window.devicePixelRatio)
        },
        iAlpha: { value: 1.0 },
        scale: { value: 1.2 },
        speed: { value: 0.15 }
      }

      // map: this.resource as THREE.Texture,
      // emissive: 0x222222,
      // opacity: 0.15,
      // transparent: true
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = -5
    // this.mesh.layers.enable(1)

    this.camera.add(this.mesh)

    if (this.debug.active && this.debugFolder) {
      this.debugFolder.addColor(this.debugObject, 'color').onChange((v: DebugObject['color']) => {
        // this.material.color = this.debugObject.color
      })
    }
  }

  update() {
    // update
    // console.log(this.time.clockElapsed)
    this.material.uniforms.iTime.value = this.time.clockElapsed
  }
}
