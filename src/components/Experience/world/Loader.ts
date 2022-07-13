// Utils
import { gsap } from "gsap";

// Components
import Experience from "../Experience";

export default class Loader {
  experience: Experience;
  resources: Experience["resources"];

  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      window.store.dispatch.app.setReady();
    });

    this.resources.on("progress", (...args: any[]) => {
      const [url, loaded, total] = args;
      // Waiting 0.5 seconds because of the css transition on the loader
      gsap.delayedCall(0.5, () => {
        window.store.dispatch.app.setLoadingProgress(loaded / total);
      });
    });
  }
}
