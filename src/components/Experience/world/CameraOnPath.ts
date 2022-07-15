// Utils
import * as THREE from "three";
import { gsap } from "gsap";

// Components
import Experience from "../Experience";

export default class CameraOnPath {
  experience: Experience;
  scene: Experience["scene"];
  sizes: Experience["sizes"];
  renderer: Experience["renderer"];
  points: [number, number, number][];
  vertices!: THREE.Vector3[];
  camera!: THREE.PerspectiveCamera;
  cameraHelper!: THREE.CameraHelper;
  curvePath!: THREE.CatmullRomCurve3;
  percentage: number;
  bodyHeight?: number;
  lookAt: {
    head: THREE.Vector3;
    body: THREE.Vector3;
  };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.renderer = this.experience.renderer;
    // How to retrive the points from Blender
    // from the python console:
    // filename = "/Users/giulio/Desktop/Personal data/Portfolio 2022/Blender script/export_curve_points.py"
    // exec(compile(open(filename).read(), filename, 'exec'))
    this.points = [
      [1.7021034955978394, -1.5984344482421875, 5.462369441986084],
      [6.072937965393066, 4.494833946228027, 5.463857173919678],
      [-1.9652289152145386, 5.223184585571289, 5.032614231109619],
      [-2.809330940246582, -1.5732879638671875, 3.585028648376465],
      [0.23759925365447998, -2.4275574684143066, 4.409247875213623],
    ];
    this.vertices = [];
    this.lookAt = {
      head: new THREE.Vector3(0, 3.4, 0),
      body: new THREE.Vector3(0, 3, 0),
    };
    this.percentage = 0;

    this.setBodyHeight();
    this.setCamera();
    this.setPath();
  }

  setBodyHeight() {
    const store = window.store;
    let prevScroll = store.getState().scroll;

    store.subscribe(() => {
      const currentScroll = store.getState().scroll;
      if (currentScroll !== prevScroll) {
        prevScroll = currentScroll;
        this.bodyHeight = window.document.body.clientHeight - this.sizes.height;
      }
    });
  }

  setCamera() {
    const { width, height } = this.sizes;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
    // Set the camera in front of the face of the man
    this.camera.position.set(0, 3.4, 0.3);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera);

    if (this.renderer.debugObject.orbitControls) {
      this.cameraHelper = new THREE.CameraHelper(this.camera);
      this.scene.add(this.cameraHelper);
    }
  }

  setPath() {
    const scale = 1;

    // Convert the array of points into vertices
    // (in Blender the z axis is UP so we swap the z and y)
    for (let i = 0; i < this.points.length; i++) {
      const x = this.points[i][0] * scale;
      const y = this.points[i][1] * scale;
      const z = this.points[i][2] * scale - 1.5;
      this.vertices[i] = new THREE.Vector3(x, z, -y);
    }

    // Create a path from the points
    this.curvePath = new THREE.CatmullRomCurve3(this.vertices);
    const radius = 0.25;
    const geometry = new THREE.TubeGeometry(
      this.curvePath,
      50,
      radius,
      10,
      false
    );

    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    const tube = new THREE.Mesh(geometry, material);
    this.scene.add(tube);
  }

  update() {
    if (!this.bodyHeight) {
      const app = window.store.getState().app;
      if (!app.ready) return;
      // x, z, -y
      const index = this.vertices.length - 1;
      gsap.to(this.camera.position, {
        x: this.vertices[index].x,
        y: this.vertices[index].y,
        z: this.vertices[index].z,
        duration: 3.5,
        delay: 1,
        ease: "power4.out",
      });

      gsap.to(this.lookAt.head, {
        y: this.lookAt.body.y,
        duration: 3.5,
        delay: 1,
        ease: "power4.out",
      });

      this.camera.lookAt(this.lookAt.head);

      return;
    }

    // this.percentage += 0.00095;
    this.percentage = 1 - window.scrollY / this.bodyHeight;
    const p1 = this.curvePath.getPointAt(this.percentage);

    this.camera.position.x = p1.x;
    this.camera.position.y = p1.y;
    this.camera.position.z = p1.z;
    this.camera.lookAt(this.lookAt.body);

    if (this.renderer.debugObject.orbitControls) {
      this.cameraHelper.update();
    }
  }

  resize() {
    this.bodyHeight = window.document.body.clientHeight - this.sizes.height;
  }
}
