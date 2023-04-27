import * as THREE from 'three'

// Types
import type { GUI } from 'lil-gui'
import type { LoadResult } from '../utils/Resources'

// Components
import Experience from '../Experience'

type DebugObject = {
  positionZ: number
  positionY: number
  color: THREE.Color
}

export default class Smoke {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  debug: Experience['debug']
  time: Experience['time']
  resource: LoadResult
  debugFolder: GUI | undefined
  debugObject: DebugObject

  geometry!: THREE.PlaneGeometry
  material!: THREE.MeshLambertMaterial
  particles!: THREE.Mesh[]

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.resource = this.resources.items.smoke
    this.time = this.experience.time

    this.debug = this.experience.debug

    if (this.debug.active && this.debug.ui) {
      this.debugFolder = this.debug.ui.addFolder('Smoke').close()
    }

    this.debugObject = {
      positionZ: -1,
      positionY: 0,
      color: new THREE.Color(0x0000ff)
    }

    this.createGeometry()
    this.createMaterial()
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(3, 3)
  }

  createMaterial() {
    this.material = new THREE.MeshLambertMaterial({
      color: this.debugObject.color,
      map: this.resource as THREE.Texture,
      emissive: 0x222222,
      opacity: 0.15,
      transparent: true
    })

    this.particles = []

    for (let i = 0; i < 20; i++) {
      const smokeElement = new THREE.Mesh(this.geometry, this.material)
      smokeElement.scale.set(2, 2, 2)
      smokeElement.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10,
        this.debugObject.positionZ
      )
      smokeElement.rotation.z = Math.random() * Math.PI * 2

      this.scene.add(smokeElement)
      this.particles.push(smokeElement)
    }

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, 'positionZ')
        .min(-100)
        .max(10)
        .step(1)
        .onChange((v: DebugObject['positionZ']) => {
          for (let i = 0; i < this.particles.length; i++) {
            const smokeElement = this.particles[i]
            smokeElement.position.z = v
          }
        })
      this.debugFolder
        .add(this.debugObject, 'positionY')
        .min(-10)
        .max(10)
        .step(1)
        .onChange((v: DebugObject['positionY']) => {
          for (let i = 0; i < this.particles.length; i++) {
            const smokeElement = this.particles[i]
            smokeElement.position.y = v
          }
        })
      this.debugFolder
        .addColor(this.debugObject, 'color')
        .onChange((v: DebugObject['color']) => {
          this.material.color = new THREE.Color(v)
        })
    }
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      const smokeElement = this.particles[i]
      smokeElement.rotation.z += this.time.delta * 0.0001
    }
  }
}
