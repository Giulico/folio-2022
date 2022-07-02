// Types
import type { GUI } from "lil-gui";

// Components
import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];
  debug: Experience["debug"];
  debugFolder: GUI | undefined;
  sunLight!: THREE.DirectionalLight;
  environmentMap!: {
    intensity: number;
    texture: THREE.CubeTexture;
    encoding: THREE.TextureEncoding;
    updateMaterial?: () => void;
  };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder("Environment").close();
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 1.5);
    // this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(-0.9, -1.76, 1.2);

    this.scene.add(this.sunLight);

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .min(0)
        .max(10)
        .name("sunLightIntensity");
      this.debugFolder
        .add(this.sunLight.position, "x")
        .min(-5)
        .max(5)
        .name("sunLightX");
      this.debugFolder
        .add(this.sunLight.position, "y")
        .min(-5)
        .max(5)
        .name("sunLightY");
      this.debugFolder
        .add(this.sunLight.position, "z")
        .min(-5)
        .max(5)
        .name("sunLightZ");
    }
  }

  setEnvironmentMap() {
    if (!this.resources.items.environmentMapTexture) {
      return;
    }

    this.environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture as THREE.CubeTexture,
      encoding: THREE.sRGBEncoding,
    };
    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterial();

    this.scene.environment = this.environmentMap.texture;

    // Debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .min(0)
        .max(4)
        .name("mapIntensity")
        .onChange(this.environmentMap.updateMaterial);
    }
  }
}
