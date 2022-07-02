import * as THREE from "three";

// Types
import type { GUI } from "lil-gui";
import type { LoadResult } from "../utils/Resources";

// Utils
import lerp from "utils/lerp";

// Components
import Experience from "../Experience";

type Uniforms = {
  colorA: THREE.Color;
  colorB: THREE.Color;
  depth: number;
  displacement: number;
  displacementMap: LoadResult;
  heightMap: LoadResult;
  iterations: number;
  smoothing: number;
  time: number;
};
type UniformsValue = {
  [P in keyof Uniforms]: { value: Uniforms[P] };
};

interface AnimationAction extends THREE.AnimationAction {
  _clip?: THREE.AnimationClip;
}

export default class Man {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];
  debug: Experience["debug"];
  sizes: Experience["sizes"];
  time: Experience["time"];
  resource: LoadResult;
  renderer: Experience["renderer"]["instance"];
  debugFolder: GUI | undefined;
  model!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  material!: THREE.MeshStandardMaterial;
  mesh!: THREE.SkinnedMesh;
  controllers!: {
    roughness: number;
    multipliers: {
      A: number;
      B: number;
    };
    colors: {
      A: number;
      B: number;
    };
  };
  uniforms!: UniformsValue;
  animation!: {
    mixer: THREE.AnimationMixer;
    actions?: {
      [key: string]: AnimationAction[];
    };
    play?: (name: string) => void;
  };

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.manModel;
    this.time = this.experience.time;
    this.renderer = this.experience.renderer.instance;

    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder("Man").close();
    }

    this.setModel();
    this.setCamera();
    this.setMaterial();
    this.setAnimation();
  }

  setModel() {
    if (!this.resource.scene) return;

    this.model = this.resource.scene;
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setCamera() {
    if (!this.resource.cameras) return;

    this.camera = this.camera || this.resource.cameras[0];
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
  }

  setMaterial() {
    this.controllers = {
      roughness: 0.2,
      multipliers: {
        A: 0.03,
        B: 0.38,
      },
      colors: {
        A: 0xffffff,
        B: 0x003994,
      },
    };
    this.uniforms = {
      iterations: { value: 59 },
      depth: { value: 1.9 },
      smoothing: { value: 0.8 },
      colorA: {
        value: new THREE.Color(this.controllers.colors.A).multiplyScalar(
          this.controllers.multipliers.A
        ),
      },
      colorB: {
        value: new THREE.Color(this.controllers.colors.B).multiplyScalar(
          this.controllers.multipliers.B
        ),
      },
      heightMap: { value: this.resources.items.manSkin },
      displacementMap: { value: this.resources.items.manSkinDisplacement },
      displacement: { value: 2.06 },
      time: { value: this.time.delta },
    };

    this.material = new THREE.MeshStandardMaterial({
      roughness: this.controllers.roughness,
    });

    const manArmature = this.model.children.find(
      (child) => child.userData.name === "Armature"
    );
    if (!manArmature) throw new Error("Man's Armature mesh not found");

    this.mesh = manArmature.children.find(
      (child) => child instanceof THREE.SkinnedMesh
    ) as THREE.SkinnedMesh;

    this.resources.items.manSkinDisplacement.wrapS = THREE.RepeatWrapping;
    this.resources.items.manSkinDisplacement.wrapT = THREE.RepeatWrapping;

    this.resources.items.manSkin.minFilter = THREE.NearestFilter;
    this.resources.items.manSkinDisplacement.minFilter = THREE.NearestFilter;

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.controllers, "roughness")
        .min(0.01)
        .max(1)
        .step(0.01)
        .name("Roughness")
        .onChange((v: number) => (this.material.roughness = v));
      this.debugFolder
        .add(this.uniforms.iterations, "value")
        .min(1)
        .max(100)
        .step(1)
        .name("Iterations");
      this.debugFolder
        .add(this.uniforms.depth, "value")
        .min(0.1)
        .max(3)
        .step(0.1)
        .name("Depth");
      this.debugFolder
        .add(this.uniforms.smoothing, "value")
        .min(0.1)
        .max(3)
        .step(0.1)
        .name("Smoothing");
      this.debugFolder
        .add(this.uniforms.displacement, "value")
        .min(0.01)
        .max(5)
        .step(0.01)
        .name("Displacement");
      this.debugFolder
        .addColor(this.controllers.colors, "A")
        .name("Color A")
        .onChange(() => {
          this.uniforms.colorA.value.set(
            new THREE.Color(this.controllers.colors.A).multiplyScalar(
              this.controllers.multipliers.A
            )
          );
        });
      this.debugFolder
        .add(this.controllers.multipliers, "A")
        .min(-2)
        .max(2)
        .step(0.01)
        .name("Multiplier A")
        .onChange(() => {
          this.uniforms.colorA.value.set(
            new THREE.Color(this.controllers.colors.A).multiplyScalar(
              this.controllers.multipliers.A
            )
          );
        });
      this.debugFolder
        .addColor(this.controllers.colors, "B")
        .name("Color B")
        .onChange(() => {
          this.uniforms.colorB.value.set(
            new THREE.Color(this.controllers.colors.B).multiplyScalar(
              this.controllers.multipliers.B
            )
          );
        });
      this.debugFolder
        .add(this.controllers.multipliers, "B")
        .min(-2)
        .max(2)
        .step(0.01)
        .name("Multiplier B")
        .onChange(() => {
          this.uniforms.colorB.value.set(
            new THREE.Color(this.controllers.colors.B).multiplyScalar(
              this.controllers.multipliers.B
            )
          );
        });
    }

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms = { ...shader.uniforms, ...this.uniforms };

      // Add to top of vertex shader
      shader.vertexShader =
        `
        varying vec3 v_pos;
        varying vec3 v_dir;
      ` + shader.vertexShader;

      // Assign values to varyings inside of main()
      shader.vertexShader = shader.vertexShader.replace(
        /void main\(\) {/,
        (match) =>
          match +
          `
        v_dir = position - cameraPosition; // Points from camera to vertex
        v_pos = position;
      `
      );
      // Add to top of fragment shader
      shader.fragmentShader =
        `
            #define FLIP vec2(1., -1.)
            
            uniform vec3 colorA;
            uniform vec3 colorB;
            uniform sampler2D heightMap;
            uniform sampler2D displacementMap;
            uniform int iterations;
            uniform float depth;
            uniform float smoothing;
            uniform float displacement;
            uniform float time;
            
            varying vec3 v_pos;
            varying vec3 v_dir;
          ` + shader.fragmentShader;

      // Add above fragment shader main() so we can access common.glsl.js
      shader.fragmentShader = shader.fragmentShader.replace(
        /void main\(\) {/,
        (match) =>
          `
             /**
             * @param p - Point to displace
             * @param strength - How much the map can displace the point
             * @returns Point with scrolling displacement applied
             */
            vec3 displacePoint(vec3 p, float strength) {
              vec2 uv = equirectUv(normalize(p));
              vec2 scroll = vec2(time, 0.);
              vec3 displacementA = texture(displacementMap, uv + scroll).rgb; // Upright
              vec3 displacementB = texture(displacementMap, uv * FLIP - scroll).rgb; // Upside down
              
              // Center the range to [-0.5, 0.5], note the range of their sum is [-1, 1]
              displacementA -= 0.5;
              displacementB -= 0.5;
              
              return p + strength * (displacementA + displacementB);
            }
            
            /**
              * @param rayOrigin - Point on sphere
              * @param rayDir - Normalized ray direction
              * @returns Diffuse RGB color
              */
            vec3 marchMarble(vec3 rayOrigin, vec3 rayDir) {
              float perIteration = 1. / float(iterations);
              vec3 deltaRay = rayDir * perIteration * depth;
    
              // Start at point of intersection and accumulate volume
              vec3 p = rayOrigin;
              float totalVolume = 0.;
    
              for (int i=0; i<iterations; ++i) {
                // Read heightmap from spherical direction of displaced ray position
                vec3 displaced = displacePoint(p, displacement);
                vec2 uv = equirectUv(normalize(displaced));
                float heightMapVal = texture(heightMap, uv).r;
    
                // Take a slice of the heightmap
                float height = length(p); // 1 at surface, 0 at core, assuming radius = 1
                float cutoff = 1. - float(i) * perIteration;
                float slice = smoothstep(cutoff, cutoff + smoothing, heightMapVal);
    
                // Accumulate the volume and advance the ray forward one step
                totalVolume += slice * perIteration;
                p += deltaRay;
              }
              return toneMapping(mix(colorA, colorB, totalVolume));
            }
          ` + match
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        /vec4 diffuseColor.*;/,
        `
            vec3 rayDir = normalize(v_dir);
            vec3 rayOrigin = v_pos;
            
            vec3 rgb = marchMarble(rayOrigin, rayDir);
            vec4 diffuseColor = vec4(rgb, 1.);      
          `
      );
    };

    this.mesh.material = this.material;
  }

  setAnimation() {
    if (!this.resource.animations?.length) {
      return;
    }

    const findAnimation = (name: string): THREE.AnimationClip => {
      const a = this.resource.animations?.find(
        (a) => a.name === name
      ) as THREE.AnimationClip;
      if (!a) new Error(`Animation ${name} not found`);
      return a;
    };

    this.animation = {
      mixer: new THREE.AnimationMixer(this.model),
    };
    this.animation.actions = {
      initClip: [this.animation.mixer.clipAction(findAnimation("Camera.00"))],
      action01: [
        this.animation.mixer.clipAction(findAnimation("Camera.01")),
        this.animation.mixer.clipAction(findAnimation("Armature.01")),
      ],
      action02: [
        this.animation.mixer.clipAction(findAnimation("Camera.02")),
        this.animation.mixer.clipAction(findAnimation("Armature.02")),
      ],
    };

    // Start initial animation
    this.animation.actions.initClip[0].clampWhenFinished = true;
    this.animation.actions.initClip[0].loop = THREE.LoopOnce;
    this.animation.actions.initClip[0].play();

    // Set current
    this.animation.actions.current = this.animation.actions.action01;

    this.animation.play = (name) => {
      if (!this.animation.actions?.[name]) return;

      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      const newCamera = newAction.find((a) =>
        a._clip?.name.startsWith("Camera")
      );
      const newArmature = newAction.find((a) =>
        a._clip?.name.startsWith("Armature")
      );

      const oldCamera = oldAction.find((a) =>
        a._clip?.name.startsWith("Camera")
      );
      const oldArmature = oldAction.find((a) =>
        a._clip?.name.startsWith("Armature")
      );

      if (!newCamera || !newArmature || !oldCamera || !oldArmature) {
        new Error(`newCamera nor newArmature not found`);
        return;
      }

      newCamera.reset();
      newCamera.clampWhenFinished = true;
      newCamera.loop = THREE.LoopOnce;
      newCamera.play();
      newCamera.crossFadeFrom(oldCamera, 1, true);

      newArmature.reset();
      newArmature.clampWhenFinished = true;
      newArmature.loop = THREE.LoopOnce;
      newArmature.play();
      newArmature.crossFadeFrom(oldArmature, 1, true);

      this.animation.actions.current = newAction;
    };

    // this.animation.play("action01", { paused: true, first: true });

    if (this.debug.active && this.debugFolder) {
      const debugObject = {
        action01: () => {
          this.animation.play?.("action01");
        },
        action02: () => {
          this.animation.play?.("action02");
        },
      };

      this.debugFolder.add(debugObject, "action01");
      this.debugFolder.add(debugObject, "action02");
    }
  }

  resize() {
    this.setCamera();
  }

  update() {
    const delta = this.time.delta * 0.001;
    this.animation.mixer.update(delta);

    this.uniforms.time.value += delta * 0.05;

    if (this.resource.cameras) {
      const camera = this.resource.cameras[0];
      camera.position.x = lerp(camera.position.x, window.cursor.x * 0.2, 0.1);
      camera.position.y = lerp(camera.position.y, window.cursor.y * 0.2, 0.1);
    }
  }
}
