// Types
import type Resources from './utils/Resources'
import type { GUI } from 'lil-gui'

// Components
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

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
  finalPass!: ShaderPass
  finalComposer!: EffectComposer
  debugFolder: GUI | undefined
  debugObject!: DebugObject
  controls: OrbitControls | undefined
  camera: PerspectiveCamera | undefined
  controlsCamera: PerspectiveCamera | undefined
  cameraHelper!: THREE.CameraHelper
  bloomLayer!: THREE.Layers
  darkMaterial: THREE.MeshBasicMaterial
  materials: {
    [key: string]: any
  }

  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.time = this.experience.time

    this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
    this.materials = {}

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Postprocessing').close()
    }

    this.setInstance()
  }

  setOrbitControls() {
    this.camera = this.experience.world.cameraOnPath.camera
    if (showOrbitControls) {
      const { width, height } = this.sizes
      this.controlsCamera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000)
      // this.controlsCamera.layers.enable(1)
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
    this.bloomLayer = new THREE.Layers()
    this.bloomLayer.set(1)

    const effect = composerEffect as string
    if (effect === 'neon' && this.camera) {
      const renderScene = new RenderPass(this.scene, this.camera)

      this.debugObject = {
        exposure: 0.69,
        bloomThreshold: 0.041,
        bloomStrength: 6.0,
        bloomRadius: 0.5
      }

      // this.instance.toneMappingExposure = Math.pow(this.debugObject.exposure, 4.0)

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(this.sizes.width, this.sizes.height),
        1.5,
        0.4,
        0.85
      )
      bloomPass.threshold = this.debugObject.bloomThreshold
      bloomPass.strength = this.debugObject.bloomStrength
      bloomPass.radius = this.debugObject.bloomRadius

      this.composer = new EffectComposer(this.instance)
      this.composer.renderToScreen = false
      // this.composer.setSize(this.sizes.width, this.sizes.height)
      this.composer.addPass(renderScene)
      this.composer.addPass(bloomPass)

      // Final composer
      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: this.composer.renderTarget2.texture }
          },
          vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
          fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }
        `,
          defines: {}
        }),
        'baseTexture'
      )
      finalPass.needsSwap = true

      this.finalComposer = new EffectComposer(this.instance)
      this.finalComposer.addPass(renderScene)
      this.finalComposer.addPass(finalPass)

      if (this.debug.active && this.debugFolder) {
        // this.debugFolder.add(this.debugObject, 'exposure', 0.1, 2).onChange((value: number) => {
        //   this.instance.toneMappingExposure = Math.pow(value, 4.0)
        // })

        this.debugFolder
          .add(this.debugObject, 'bloomThreshold', 0.0, 5.0)
          .step(0.001)
          .onChange(function (value: number) {
            bloomPass.threshold = Number(value)
          })

        this.debugFolder
          .add(this.debugObject, 'bloomStrength', 0.0, 10.0)
          .step(0.01)
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
        4 // sigma ?
        // 256 // blur render target resolution
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
    } else if (effect === 'outline') {
      const camera = this.experience.world.cameraOnPath.camera
      this.composer = new EffectComposer(this.instance)
      this.composer.addPass(new RenderPass(this.scene, camera))
      this.composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height), 1, 1, 0.5)
      )
    } else if (effect === 'lambert' && this.camera) {
      const renderScene = new RenderPass(this.scene, this.camera)
      this.debugObject = {
        bloomThreshold: 0.02,
        bloomStrength: 7,
        bloomRadius: 0.7
      }
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(this.sizes.width, this.sizes.height),
        1.5,
        0.4,
        0.85
      )
      bloomPass.threshold = this.debugObject.bloomThreshold
      bloomPass.strength = this.debugObject.bloomStrength
      bloomPass.radius = this.debugObject.bloomRadius

      this.composer = new EffectComposer(this.instance)
      this.composer.renderToScreen = false
      this.composer.addPass(renderScene)
      this.composer.addPass(bloomPass)

      this.finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: this.composer.renderTarget2.texture }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
          `,
          fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            varying vec2 vUv;
            void main() {
              gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
            }
          `,
          defines: {}
        }),
        'baseTexture'
      )
      this.finalPass.needsSwap = true

      this.finalComposer = new EffectComposer(this.instance)
      this.finalComposer.addPass(renderScene)
      this.finalComposer.addPass(this.finalPass)

      if (this.debug.active && this.debugFolder) {
        this.debugFolder
          .add(this.debugObject, 'bloomThreshold', 0.0, 5.0)
          .step(0.001)
          .onChange(() => {
            bloomPass.threshold = this.debugObject.bloomThreshold
          })

        this.debugFolder
          .add(this.debugObject, 'bloomStrength', 0.0, 10.0)
          .step(0.001)
          .onChange(() => {
            bloomPass.strength = this.debugObject.bloomStrength
          })

        this.debugFolder
          .add(this.debugObject, 'bloomRadius', 0.0, 1.0)
          .step(0.001)
          .onChange(() => {
            bloomPass.radius = this.debugObject.bloomRadius
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
    this.instance.toneMapping = THREE.ReinhardToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = false
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.autoClear = false
    // this.instance.setClearColor('#ff0000')
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  darkenNonBloomed(object: THREE.Object3D<THREE.Event>): void {
    const obj = object as THREE.Mesh
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material
      obj.material = this.darkMaterial
    }
  }

  restoreMaterial(object: THREE.Object3D<THREE.Event>) {
    const obj = object as THREE.Mesh
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid]
      delete this.materials[obj.uuid]
    }
  }

  renderBloom() {
    this.scene.traverse(this.darkenNonBloomed.bind(this))
    this.composer.render()
    this.scene.traverse(this.restoreMaterial.bind(this))
  }

  update() {
    const effect = composerEffect as string
    if (
      this.experience.resources.items.manModel?.cameras &&
      this.experience.world?.cameraOnPath?.camera
    ) {
      if (effect === 'lambert' && this.camera) {
        // render scene with bloom
        this.renderBloom()

        // render the entire scene, then render bloom scene on top
        this.finalComposer.render()
      } else if (this.composer) {
        this.composer.render()
      } else if (showOrbitControls && this.controlsCamera) {
        this.instance.render(this.scene, this.controlsCamera)
      } else if (this.camera) {
        this.instance.render(this.scene, this.camera)
      }
    }

    if (this.controls) {
      this.controls.update()
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height)
    }
  }
}
