import Experience from "../Experience";
import Environment from "./Environment";
import Man from "./Man";
import Smoke from "./Smoke";

export default class World {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];
  man: Man | undefined;
  smoke: Smoke | undefined;
  environment: Environment | undefined;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Listeners
    this.resources.on("ready", () => {
      // Setup
      this.man = new Man();
      this.smoke = new Smoke();
      this.environment = new Environment();
    });
  }

  resize() {
    this.man?.resize?.();
  }

  update() {
    this.man?.update?.();
    this.smoke?.update?.();
  }
}
