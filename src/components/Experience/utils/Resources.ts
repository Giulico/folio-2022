// Types
import type { Sources } from '../sources'
import type Renderer from '../Renderer'

import EventEmitter from 'utils/EventEmitter'
import * as THREE from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export type LoadResult = (
  | THREE.Texture
  | THREE.CubeTexture
  | THREE.DataTexture
  | GLTF
  | string
  | ArrayBuffer
) & {
  cameras?: THREE.PerspectiveCamera[]
  animations?: THREE.AnimationClip[]
  scene?: THREE.Scene
  wrapS?: number
  wrapT?: number
  minFilter?: number
}

export default class Resources extends EventEmitter {
  items: { [key: string]: LoadResult }
  sources: Sources
  renderer: Renderer['instance']
  loaders: {
    dracoLoader?: DRACOLoader
    gltfLoader?: GLTFLoader
    textureLoader?: THREE.TextureLoader
    cubeTextureLoader?: THREE.CubeTextureLoader
    hdrLoader?: RGBELoader
    fileLoader?: THREE.FileLoader
  }
  manager: THREE.LoadingManager

  constructor(sources: Sources, renderer: Renderer['instance']) {
    super()

    // https://threejs.org/docs/#api/en/loaders/FileLoader
    THREE.Cache.enabled = true

    // Options
    this.sources = sources
    this.renderer = renderer

    this.items = {}

    this.manager = new THREE.LoadingManager(
      this.onResourceLoad.bind(this),
      this.onResourceProgress.bind(this)
    )

    this.loaders = {}
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.dracoLoader.setDecoderPath('draco/')

    this.loaders.gltfLoader = new GLTFLoader(this.manager)
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)

    this.loaders = {
      ...this.loaders,
      textureLoader: new THREE.TextureLoader(this.manager),
      cubeTextureLoader: new THREE.CubeTextureLoader(this.manager),
      hdrLoader: new RGBELoader(this.manager),
      fileLoader: new THREE.FileLoader(this.manager)
    }

    this.startLoading()
  }

  onResourceLoad() {
    this.trigger('ready')
  }

  onResourceProgress(url: string, loaded: number, total: number) {
    this.trigger('progress', [url, loaded, total])
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case 'gltfModel':
          this.loaders.gltfLoader?.load(source.path as string, (file) => {
            this.items[source.name] = file as LoadResult
          })
          break

        case 'texture':
          this.loaders.textureLoader?.load(source.path as string, (file) => {
            this.items[source.name] = file
          })
          break

        case 'cubeTexture':
          this.loaders.cubeTextureLoader?.load(source.path as string[], (file) => {
            this.items[source.name] = file
          })
          break

        case 'hdr': {
          const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
          this.loaders.hdrLoader?.load(source.path as string, (file) => {
            const envMap = pmremGenerator.fromEquirectangular(file).texture
            file.dispose()
            pmremGenerator.dispose()
            this.items[source.name] = envMap
          })
          break
        }

        case 'file': {
          this.loaders.fileLoader?.load(source.path as string, (file) => {
            this.items[source.name] = file
          })
          break
        }

        default:
          break
      }
    }
  }
}
