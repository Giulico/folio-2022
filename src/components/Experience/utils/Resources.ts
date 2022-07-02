// Types
import type { Source, Sources } from "../sources";
import type Renderer from "../Renderer";

import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export type LoadResult = (
  | THREE.Texture
  | THREE.CubeTexture
  | THREE.DataTexture
  | GLTF
) & {
  cameras?: THREE.PerspectiveCamera[];
  animations?: THREE.AnimationClip[];
  scene?: THREE.Scene;
  wrapS?: number;
  wrapT?: number;
  minFilter?: number;
};

export default class Resources extends EventEmitter {
  items: { [key: string]: LoadResult };
  sources: Sources;
  renderer: Renderer["instance"];
  toLoad: number;
  loaded: number;
  loaders: {
    gltfLoader: GLTFLoader;
    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;
    hdrLoader: RGBELoader;
  };

  constructor(sources: Sources, renderer: Renderer["instance"]) {
    super();

    // Options
    this.sources = sources;
    this.renderer = renderer;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
      hdrLoader: new RGBELoader(),
    };

    this.startLoading();
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(source.path as string, (file) => {
            this.sourceLoaded(source, file as LoadResult);
          });
          break;

        case "texture":
          this.loaders.textureLoader.load(source.path as string, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(
            source.path as string[],
            (file) => {
              this.sourceLoaded(source, file);
            }
          );
          break;

        case "hdr":
          const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
          this.loaders.hdrLoader.load(source.path as string, (file) => {
            const envMap = pmremGenerator.fromEquirectangular(file).texture;
            file.dispose();
            pmremGenerator.dispose();
            this.sourceLoaded(source, envMap);
          });
          break;

        default:
          break;
      }
    }
  }

  sourceLoaded(source: Source, file: LoadResult) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
