// Types
import type Resources from "./utils/Resources";
import type { GUI } from "lil-gui";

// Components
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";

import Experience from "./Experience";
import { PerspectiveCamera } from "three";

type DebugObject = {
  strength: number;
  sCount: number;
  grayscale: number;
  nIntensity: number;
  sIntensity: number;
  orbitControls: boolean;
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
  controls: OrbitControls | undefined;
  controlsCamera: PerspectiveCamera | undefined;
  cameraHelper!: THREE.CameraHelper;

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
      strength: 0.9,
      sCount: 115,
      grayscale: 0,
      nIntensity: 0.15,
      sIntensity: 0.18,
      orbitControls: false,
    };

    this.setInstance();
  }

  setOrbitControls(resources: Resources) {
    if (this.debugObject.orbitControls && resources.items.manModel?.cameras) {
      const { width, height } = this.sizes;
      this.controlsCamera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.01,
        1000
      );
      this.controls = new OrbitControls(this.controlsCamera, this.canvas);
      this.controlsCamera.position.set(0, 2.5, 3);
      this.controls.target.set(0, 2.5, 0);
      this.controls.enableDamping = true;
      this.controls.update();

      // Add pointer-events: none to all DOM sections
      // In order to allow the OrbitControls from stealing the mouse events
      const domSections = document.querySelectorAll("section");
      domSections.forEach((section) => {
        section.style.pointerEvents = "none";
      });

      // this.cameraHelper = new THREE.CameraHelper(
      //   resources.items.manModel.cameras[0]
      // );
      // this.scene.add(this.cameraHelper);

      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    }
  }

  setComposer(resources: Resources) {
    return;
    /*
    if (!resources.items.manModel.cameras || this.debugObject.orbitControls)
      return;

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
      this.debugFolder.add(this.debugObject, "orbitControls");
    }
    */
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
    if (
      this.experience.resources.items.manModel?.cameras &&
      this.experience.world?.cameraOnPath?.camera
    ) {
      // const camera =
      //   this.debugObject.orbitControls && this.controlsCamera
      //     ? this.controlsCamera
      //     : this.experience.resources.items.manModel.cameras[0];
      const camera =
        this.debugObject.orbitControls && this.controlsCamera
          ? this.controlsCamera
          : this.experience.world.cameraOnPath.camera;

      if (camera) {
        this.instance.render(this.scene, camera);
      }
    }

    if (this.controls) {
      this.controls.update();
      // this.cameraHelper.update();
    }

    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height);
      this.composer.render(this.time.delta);
    }
  }
}
