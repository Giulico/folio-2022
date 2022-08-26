import * as THREE from 'three'

// Types
import type { GUI } from 'lil-gui'

// Components
import Experience from '../Experience'

type DebugObject = {
  color: THREE.Color
}

export default class Strikes {
  experience: Experience
  scene: Experience['scene']
  debug: Experience['debug']
  time: Experience['time']
  debugFolder: GUI | undefined
  debugObject: DebugObject

  geometry!: THREE.PlaneGeometry
  material!: THREE.MeshLambertMaterial
  mesh!: THREE.Mesh
  camera: THREE.PerspectiveCamera

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.camera = this.experience.world.cameraOnPath.camera

    this.debug = this.experience.debug

    if (this.debug.active && this.debug.ui) {
      this.debugFolder = this.debug.ui.addFolder('Strikes').close()
    }

    this.debugObject = {
      color: new THREE.Color(0xffffff)
    }

    this.createGeometry()
    this.createMaterial()
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10)
  }

  createMaterial() {
    this.material = new THREE.MeshLambertMaterial({
      color: this.debugObject.color
      // fragmentShader,
      // vertexShader,
      // map: this.resource as THREE.Texture,
      // emissive: 0x222222,
      // opacity: 0.15,
      // transparent: true
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = -3
    // this.mesh.layers.enable(1)

    // this.camera.add(this.mesh)

    if (this.debug.active && this.debugFolder) {
      this.debugFolder.addColor(this.debugObject, 'color').onChange((v: DebugObject['color']) => {
        this.material.color = this.debugObject.color
      })
    }
  }

  update() {
    // update
  }
}
