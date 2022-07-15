import Experience from "../Experience";
import Environment from "./Environment";
import Man from "./Man";
import Smoke from "./Smoke";
import Portfolio from "./Portfolio";
import CameraOnPath from "./CameraOnPath";
import Loader from "./Loader";

export default class World {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];
  man: Man | undefined;
  smoke: Smoke | undefined;
  environment: Environment | undefined;
  portfolio: Portfolio | undefined;
  cameraOnPath: CameraOnPath | undefined;
  loader: Loader;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.loader = new Loader();
    this.cameraOnPath = new CameraOnPath();

    // Listeners
    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
      this.man = new Man();
      // this.smoke = new Smoke();
      // this.portfolio = new Portfolio();
    });
  }

  resize() {
    this.man?.resize?.();
    this.cameraOnPath?.resize?.();
  }

  update() {
    this.man?.update?.();
    this.smoke?.update?.();
    this.portfolio?.update?.();
    this.cameraOnPath?.update?.();
  }
}
