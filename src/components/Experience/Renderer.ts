// Types
import type Resources from './utils/Resources'
import type { GUI } from 'lil-gui'

// Components
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'

// Classes & Settings
import { composerEffect, showOrbitControls } from 'settings'
import Experience from './Experience'
import { PerspectiveCamera } from 'three'

type DebugObject = {
  [key: string]: number
}

export default class Renderer {
  experience: Experience
  canvas: Experience['canvas']
  debug!: Experience['debug']
  sizes!: Experience['sizes']
  time!: Experience['time']
  scene!: Experience['scene']
  world!: Experience['world']
  instance!: THREE.WebGLRenderer
  composer!: EffectComposer
  debugFolder: GUI | undefined
  debugObject: DebugObject | undefined
  controls: OrbitControls | undefined
  camera: PerspectiveCamera | undefined
  controlsCamera: PerspectiveCamera | undefined
  cameraHelper!: THREE.CameraHelper

  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.world = this.experience.world
    this.time = this.experience.time
    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Postprocessing')
    }

    this.setInstance()
  }

  setOrbitControls() {
    if (showOrbitControls) {
      const { width, height } = this.sizes
      this.controlsCamera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000)
      this.controls = new OrbitControls(this.controlsCamera, this.canvas)
      this.controlsCamera.position.set(0, 2.5, 3)
      this.controls.target.set(0, 2.5, 0)
      this.controls.enableDamping = true
      this.controls.update()

      // Add pointer-events: none to all DOM sections
      // In order to allow the OrbitControls from stealing the mouse events
      const domSections = document.querySelectorAll('section')
      domSections.forEach((section) => {
        section.style.pointerEvents = 'none'
      })

      const axesHelper = new THREE.AxesHelper(5)
      this.scene.add(axesHelper)
    }
  }

  setComposer() {
    const effect = composerEffect as string
    if (effect === 'neon') {
      this.debugObject = {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 0
      }

      const renderScene = new RenderPass(this.scene, this.experience.world.cameraOnPath.camera)

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      )
      bloomPass.threshold = this.debugObject.bloomThreshold
      bloomPass.strength = this.debugObject.bloomStrength
      bloomPass.radius = this.debugObject.bloomRadius

      this.composer = new EffectComposer(this.instance)
      this.composer.addPass(renderScene)
      this.composer.addPass(bloomPass)

      if (this.debug.active && this.debugFolder) {
        this.debugFolder.add(this.debugObject, 'exposure', 0.1, 2).onChange((value: number) => {
          this.instance.toneMappingExposure = Math.pow(value, 4.0)
        })

        this.debugFolder
          .add(this.debugObject, 'bloomThreshold', 0.0, 1.0)
          .onChange(function (value: number) {
            bloomPass.threshold = Number(value)
          })

        this.debugFolder
          .add(this.debugObject, 'bloomStrength', 0.0, 3.0)
          .onChange(function (value: number) {
            bloomPass.strength = Number(value)
          })

        this.debugFolder
          .add(this.debugObject, 'bloomRadius', 0.0, 1.0)
          .step(0.01)
          .onChange(function (value: number) {
            bloomPass.radius = Number(value)
          })
      }
    } else if (effect === 'bloom') {
      if (!this.experience.world.cameraOnPath.camera || showOrbitControls) return

      this.debugObject = {
        strength: 0.9,
        sCount: 115,
        grayscale: 0,
        nIntensity: 0.15,
        sIntensity: 0.18
      }

      const camera = this.experience.world.cameraOnPath.camera
      this.composer = new EffectComposer(this.instance)
      this.composer.addPass(new RenderPass(this.scene, camera))

      const bloomPass: BloomPassExtended = new BloomPass(
        this.debugObject.strength, // strength
        25, // kernel size
        4, // sigma ?
        256 // blur render target resolution
      )
      this.composer.addPass(bloomPass)

      const filmPass: FilmPassExtended = new FilmPass(
        this.debugObject.nIntensity, // noise intensity
        this.debugObject.sIntensity, // scanline intensity
        this.debugObject.sCount, // scanline count
        this.debugObject.grayscale // grayscale
      ) as FilmPassExtended
      filmPass.renderToScreen = true
      this.composer.addPass(filmPass)

      if (this.debug.active && this.debugFolder) {
        this.debugFolder
          .add(this.debugObject, 'strength')
          .min(0)
          .max(10)
          .step(0.01)
          .name('Strength')
          .onChange((v: DebugObject['strength']): void => {
            if (bloomPass.combineUniforms) bloomPass.combineUniforms.strength.value = v
          })
        this.debugFolder
          .add(this.debugObject, 'sCount')
          .min(0)
          .max(1000)
          .step(1)
          .name('Scanline count')
          .onChange((v: DebugObject['sCount']): void => {
            if (filmPass.uniforms) filmPass.uniforms.sCount.value = v
          })
        this.debugFolder
          .add(this.debugObject, 'grayscale')
          .min(0)
          .max(1)
          .step(1)
          .name('Grayscale')
          .onChange((v: DebugObject['grayscale']): void => {
            if (filmPass.uniforms) filmPass.uniforms.grayscale.value = v
          })
        this.debugFolder
          .add(this.debugObject, 'nIntensity')
          .min(0)
          .max(1)
          .step(0.01)
          .name('Noise intensity')
          .onChange((v: DebugObject['nIntensity']): void => {
            if (filmPass.uniforms) filmPass.uniforms.nIntensity.value = v
          })
        this.debugFolder
          .add(this.debugObject, 'sIntensity')
          .min(0)
          .max(1)
          .step(0.01)
          .name('Scanline intensity')
          .onChange((v: DebugObject['sIntensity']): void => {
            if (filmPass.uniforms) filmPass.uniforms.sIntensity.value = v
          })
      }
    }
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.setClearColor('#ff0000')
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    if (
      this.experience.resources.items.manModel?.cameras &&
      this.experience.world?.cameraOnPath?.camera
    ) {
      // const camera =
      // this.debugObject.orbitControls && this.controlsCamera
      //   ? this.controlsCamera
      //   : this.experience.resources.items.manModel.cameras[0];
      const camera =
        showOrbitControls && this.controlsCamera
          ? this.controlsCamera
          : this.experience.world.cameraOnPath.camera

      if (camera) {
        this.instance.render(this.scene, camera)
      }
    }

    if (this.controls) {
      this.controls.update()
      // this.cameraHelper.update();
    }

    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height)
      this.composer.render(this.time.delta)
    }
  }
}
