// Types
import type { GUI } from 'lil-gui'

// Components
import * as THREE from 'three'
import Experience from '../Experience'

export default class Environment {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  debug: Experience['debug']
  debugFolder: GUI | undefined
  sunLightRight!: THREE.DirectionalLight
  sunLightLeft!: THREE.DirectionalLight
  ambientLight!: THREE.AmbientLight
  environmentMap!: {
    intensity: number
    texture: THREE.CubeTexture
    encoding: THREE.TextureEncoding
    updateMaterial?: () => void
  }

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Environment').close()
    }

    // this.setAmbientLight()
    // this.setSunLight()
    // this.setEnvironmentMap()
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0x91908e, 1.6) // soft white light
    this.ambientLight.castShadow = false
    this.scene.add(this.ambientLight)

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.ambientLight, 'intensity')
        .min(0)
        .max(10)
        .name('ambientLightIntensity')
    }
  }

  setSunLight() {
    this.sunLightLeft = new THREE.DirectionalLight('#ffffff', 1.5)
    this.sunLightLeft.castShadow = false
    // this.sunLightLeft.shadow.camera.far = 15
    // this.sunLightLeft.shadow.mapSize.set(1024, 1024)
    // this.sunLightLeft.shadow.normalBias = 0.05
    this.sunLightLeft.position.set(-0.1, -4, 5)

    this.sunLightRight = new THREE.DirectionalLight('#f1cf98', 1.5)
    this.sunLightRight.castShadow = false
    // this.sunLightRight.shadow.camera.far = 15
    // this.sunLightRight.shadow.mapSize.set(1024, 1024)
    // this.sunLightRight.shadow.normalBias = 0.05
    this.sunLightRight.position.set(-2, 1, -4)

    this.scene.add(this.sunLightLeft, this.sunLightRight)

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.sunLightLeft, 'intensity')
        .min(0)
        .max(10)
        .name('sunLight R Intensity')
      this.debugFolder.add(this.sunLightLeft.position, 'x').min(-20).max(20).name('sunLightX R')
      this.debugFolder.add(this.sunLightLeft.position, 'y').min(-20).max(20).name('sunLightY R')
      this.debugFolder.add(this.sunLightLeft.position, 'z').min(-20).max(20).name('sunLightZ R')
      this.debugFolder
        .add(this.sunLightRight, 'intensity')
        .min(0)
        .max(10)
        .name('sunLight L Intensity')
      this.debugFolder.add(this.sunLightRight.position, 'x').min(-20).max(20).name('sunLightX L')
      this.debugFolder.add(this.sunLightRight.position, 'y').min(-20).max(20).name('sunLightY L')
      this.debugFolder.add(this.sunLightRight.position, 'z').min(-20).max(20).name('sunLightZ L')
    }
  }

  setEnvironmentMap() {
    if (!this.resources.items.environmentMapTexture) {
      return
    }

    this.environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture as THREE.CubeTexture,
      encoding: THREE.sRGBEncoding
    }

    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }

    this.environmentMap.updateMaterial()

    this.scene.environment = this.environmentMap.texture

    // Debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .min(0)
        .max(4)
        .name('mapIntensity')
        .onChange(this.environmentMap.updateMaterial)
    }
  }
}
