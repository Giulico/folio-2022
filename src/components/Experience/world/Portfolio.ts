// Utils
import * as THREE from "three";
import { gsap } from "gsap";
import { cursorPosition } from "utils/events";
import {
  ClickableMesh,
  StateMaterialSet,
  StateMaterial,
  MouseEventManager,
  ThreeMouseEvent,
  ThreeMouseEventType,
} from "@masatomakino/threejs-interactive-object";

// Types
import type { GUI } from "lil-gui";
import type { LoadResult } from "../utils/Resources";
// Components
import Experience from "../Experience";

type DebugObject = {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  offsetZOut: number;
  pageHeightFactor: number;
};

export default class Portfolio {
  experience: Experience;
  scene: Experience["scene"];
  world: Experience["world"];
  resources: Experience["resources"];
  debug: Experience["debug"];
  sizes: Experience["sizes"];
  time: Experience["time"];
  resource: LoadResult;
  renderer: Experience["renderer"]["instance"];
  debugFolder: GUI | undefined;
  group!: THREE.Group;
  items!: THREE.Mesh[];
  debugObject: DebugObject;
  material!: THREE.MeshStandardMaterial;
  camera: THREE.PerspectiveCamera | undefined;
  isVisible: boolean = false;
  isDragging: boolean = false;
  initialDragPosition: number = 0;
  initialScrollPosition: number = 0;
  manager: MouseEventManager | undefined;
  itemsXPosition: number[] = [];

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.world = this.experience.world;

    this.resources = this.experience.resources;
    this.resource = this.resources.items.manModel;
    this.time = this.experience.time;
    this.renderer = this.experience.renderer.instance;

    this.camera = this.resource.cameras?.[0];
    if (this.camera && this.experience.renderer.canvas) {
      this.manager = new MouseEventManager(
        this.scene,
        this.camera,
        this.experience.renderer.canvas
      );
    }

    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder("Portfolio");
    }

    this.debugObject = {
      offsetX: 0.3,
      offsetY: 2.75,
      offsetZ: 4,
      offsetZOut: 0.3,
      pageHeightFactor: 2.1,
    };

    this.setItems();
    this.setEvents();
  }

  setItems() {
    const ITEMS = 5;
    this.group = new THREE.Group();
    this.group.name = "portfolio";

    // Material
    this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.items = [];

    const { offsetX, offsetY, offsetZOut } = this.debugObject;

    // Geometry
    for (let i = 0; i < ITEMS; i++) {
      const geometry = new THREE.PlaneGeometry(1, 0.7, 24, 24);

      const clickablMesh = new ClickableMesh({
        geo: geometry,
        material: new StateMaterialSet({
          normal: this.material,
        }),
      });
      clickablMesh.name = `project.${i}`;
      clickablMesh.position.set(i * 1.3 + offsetX, offsetY, offsetZOut);

      clickablMesh.addEventListener(ThreeMouseEventType.CLICK, (e) => {
        console.log("CLICKED!", e);
      });

      this.group.add(clickablMesh);
      this.items[i] = clickablMesh;
    }

    this.scene.add(this.group);

    // Debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, "offsetX")
        .min(-10)
        .max(3)
        .step(0.1);
      // .onChange((v: number) => {
      //   for (let i = 0; i < this.items.length; i++) {
      //     this.items[i].position.x = i * 2 + v;
      //   }
      // });
      this.debugFolder
        .add(this.debugObject, "offsetY")
        .min(0)
        .max(10)
        .step(0.01)
        .onChange((v: number) => {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].position.y = v;
          }
        });
      this.debugFolder
        .add(this.debugObject, "offsetZ")
        .min(-5)
        .max(5)
        .step(0.01)
        .onChange((v: number) => {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].position.z = v;
          }
        });
      this.debugFolder
        .add(this.debugObject, "pageHeightFactor")
        .min(0)
        .max(5)
        .step(0.1);
    }
  }

  setEvents() {
    if (!this.experience.renderer.canvas) return;

    const onStartDragging = (e: MouseEvent | TouchEvent) => {
      const { x } = cursorPosition(e);

      // Normaliza pointer position between -0.5 and 0.5
      this.initialDragPosition = x / this.sizes.width - 0.5;

      // Start moving
      this.isDragging = true;

      // Save the initial (of current drag) positions
      for (let i = 0; i < this.items.length; i++) {
        this.itemsXPosition[i] = this.items[i].position.x;
      }
    };

    const onFinishDragging = () => {
      this.isDragging = false;
    };

    this.experience.renderer.canvas.addEventListener(
      "mousedown",
      onStartDragging
    );
    this.experience.renderer.canvas.addEventListener(
      "touchstart",
      onStartDragging
    );
    this.experience.renderer.canvas.addEventListener(
      "mouseup",
      onFinishDragging
    );
    this.experience.renderer.canvas.addEventListener(
      "touchend",
      onFinishDragging
    );
  }

  enterAnimation(): Promise<void[]> {
    const promises = [];
    for (const item of this.items) {
      item.visible = true;
      promises.push(
        new Promise<void>((resolve) => {
          gsap.fromTo(
            item.position,
            {
              z: this.debugObject.offsetZOut,
            },
            {
              z: this.debugObject.offsetZ,
              duration: 0.3,
              onComplete: resolve,
            }
          );
        })
      );
    }
    return Promise.all(promises);
  }

  leaveAnimation() {
    const { offsetX, offsetY, offsetZOut } = this.debugObject;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.position.set(i * 1.3 + offsetX, offsetY, offsetZOut);
      item.visible = false;
    }
  }

  update() {
    if (this.isVisible && this.world.man) {
      const camera = this.world.man.camera;
      const cameraZ = camera.position.z + this.debugObject.offsetZ;
      const cameraY = camera.position.y;

      // Y
      // start 3 end 6
      const deltaYPx =
        window.scrollY + this.sizes.height - this.initialScrollPosition;
      const deltaY =
        (this.debugObject.pageHeightFactor / this.sizes.height) * deltaYPx;

      let delay = 0;
      for (const item of this.items) {
        gsap.to(item.position, {
          z: cameraZ,
          y: this.debugObject.offsetY + deltaY,
          delay,
          duration: 0.3,
        });
        delay += 0.01;
      }
    }

    if (this.isVisible && this.world.man && this.isDragging) {
      // Find the amount of movement done
      // when Click it should be 0
      const deltaX = (this.initialDragPosition - window.cursor.x) * -3;

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        let x = this.itemsXPosition[i] + deltaX;

        // Set limits
        const marginLeft = 0.4;
        const leftLimit = i * 1.3 - 1.3 * (this.items.length - 1) + marginLeft;
        const rightLimit = i * 1.3 + marginLeft;
        x = x < leftLimit ? leftLimit : x;
        x = x > rightLimit ? rightLimit : x;

        gsap.to(item.position, {
          x,
          duration: 0.3,
        });
      }
    }
  }
}
