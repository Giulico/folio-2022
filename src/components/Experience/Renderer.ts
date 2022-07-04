// Types
import type Resources from "./utils/Resources";
import type { GUI } from "lil-gui";

// Components
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";

import Experience from "./Experience";

type DebugObject = {
  strength: number;
  sCount: number;
  grayscale: number;
  nIntensity: number;
  sIntensity: number;
};

export default class Renderer {
  experience: Experience;
  canvas: Experience["canvas"];
  debug!: Experience["debug"];
  sizes!: Experience["sizes"];
  time!: Experience["time"];
  scene!: Experience["scene"];
  world!: Experience["world"];
  instance!: THREE.WebGLRenderer;
  composer!: EffectComposer;
  debugFolder: GUI | undefined;
  debugObject: DebugObject;

  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder("Postprocessing").close();
    }

    this.debugObject = {
      strength: 3.5,
      sCount: 648,
      grayscale: 0,
      nIntensity: 0.09,
      sIntensity: 0.2,
    };

    this.setInstance();
  }

  setComposer(resources: Resources) {
    if (!resources.items.manModel.cameras) return;

    const camera = resources.items.manModel.cameras[0];
    this.composer = new EffectComposer(this.instance);
    this.composer.addPass(new RenderPass(this.scene, camera));

    const bloomPass: BloomPassExtended = new BloomPass(
      this.debugObject.strength, // strength
      25, // kernel size
      4, // sigma ?
      256 // blur render target resolution
    );
    this.composer.addPass(bloomPass);

    const filmPass: FilmPassExtended = new FilmPass(
      this.debugObject.nIntensity, // noise intensity
      this.debugObject.sIntensity, // scanline intensity
      this.debugObject.sCount, // scanline count
      this.debugObject.grayscale // grayscale
    ) as FilmPassExtended;
    filmPass.renderToScreen = true;
    this.composer.addPass(filmPass);

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, "strength")
        .min(0)
        .max(10)
        .step(0.01)
        .name("Strength")
        .onChange((v: DebugObject["strength"]): void => {
          if (bloomPass.combineUniforms)
            bloomPass.combineUniforms.strength.value = v;
        });
      this.debugFolder
        .add(this.debugObject, "sCount")
        .min(0)
        .max(1000)
        .step(1)
        .name("Scanline count")
        .onChange((v: DebugObject["sCount"]): void => {
          if (filmPass.uniforms) filmPass.uniforms.sCount.value = v;
        });
      this.debugFolder
        .add(this.debugObject, "grayscale")
        .min(0)
        .max(1)
        .step(1)
        .name("Grayscale")
        .onChange((v: DebugObject["grayscale"]): void => {
          if (filmPass.uniforms) filmPass.uniforms.grayscale.value = v;
        });
      this.debugFolder
        .add(this.debugObject, "nIntensity")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Noise intensity")
        .onChange((v: DebugObject["nIntensity"]): void => {
          if (filmPass.uniforms) filmPass.uniforms.nIntensity.value = v;
        });
      this.debugFolder
        .add(this.debugObject, "sIntensity")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Scanline intensity")
        .onChange((v: DebugObject["sIntensity"]): void => {
          if (filmPass.uniforms) filmPass.uniforms.sIntensity.value = v;
        });
    }
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    // this.instance.setClearColor("#211d20");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (this.experience.resources.items.manModel?.cameras) {
      const camera = this.experience.resources.items.manModel.cameras[0];
      this.instance.render(this.scene, camera);
    }
    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height);
      this.composer.render(this.time.delta);
    }
  }
}
