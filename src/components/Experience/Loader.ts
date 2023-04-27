// Types
import type { RootState } from 'store'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import { fontLoader } from 'utils/fonts'
import StoreWatcher from './utils/StoreWatcher'

// Components
import Experience from './Experience'

// SHaders
import vertexShader from './world/shaders/loader/vertex'
import fragmentShader from './world/shaders/loader/fragment'

export default class Loader {
  experience: Experience
  sizes: Experience['sizes']
  time: Experience['time']
  camera: THREE.PerspectiveCamera
  geometry!: THREE.PlaneGeometry
  material!: THREE.ShaderMaterial
  mesh!: THREE.Mesh

  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.time = this.experience.time
    this.camera = this.experience.world.cameraOnPath.camera

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))

    Promise.all([this.fontLoader(), this.resourcesLoader(), this.firstAnimations()]).then(() => {
      window.store.dispatch.app.setLoaded()
    })

    this.createPlane()
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    if (state.app.ready && !prevState.app.ready) {
      gsap.to(this.material.uniforms.iAlpha, {
        value: 0.0,
        duration: 2.5,
        delay: 0.5,
        onComplete: () => {
          this.geometry.dispose()
          this.material.dispose()
        }
      })
    }
  }

  createPlane() {
    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      uniforms: {
        iTime: { value: this.time.clockElapsed },
        iAlpha: { value: 1.0 },
        iLight: { value: 0.0 },
        iResolution: {
          value: new THREE.Vector3(this.sizes.width, this.sizes.height, window.devicePixelRatio)
        },
        scale: { value: 1.2 },
        speed: { value: 0.15 }
      }
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = -0.01

    this.camera.add(this.mesh)
  }

  firstAnimations() {
    return new Promise((resolve) => {
      setTimeout(resolve, 4500)
    })
  }

  fontLoader() {
    return new Promise((resolve) => {
      fontLoader()
        .then(() => {
          resolve(null)
        })
        .catch(console.log)
    })
  }

  resourcesLoader() {
    return new Promise((resolve) => {
      const resources: Experience['resources'] = this.experience.resources

      resources.on('ready', () => {
        resolve(null)
      })

      resources.on('progress', (...args: any[]) => {
        const [url, loaded, total] = args
        // Waiting 0.5 seconds because of the css transition on the loader
        gsap.delayedCall(0.5, () => {
          window.store.dispatch.app.setLoadingProgress(loaded / total)
        })
      })
    })
  }

  onReady() {
    gsap.to(this.material.uniforms.iLight, {
      value: 0.4,
      duration: 3
    })
  }

  update() {
    this.material.uniforms.iTime.value = this.time.clockElapsed
  }
}
