import * as THREE from 'three'
import { gsap } from 'gsap'

// Shaders
import vertexShader from './shaders/shader2/vertex'
import fragmentShader from './shaders/shader2/fragment'

// Types
import type { GUI } from 'lil-gui'
import type { LoadResult } from '../utils/Resources'

// Components
import Experience from '../Experience'

type Uniforms = {
  colorA: THREE.Color
  colorB: THREE.Color
  depth: number
  displacement: number
  displacementMap: LoadResult
  heightMap: LoadResult
  iterations: number
  smoothing: number
  time: number
}
type UniformsValue = {
  [P in keyof Uniforms]: { value: Uniforms[P] }
}

type DebugObject = {
  roughness: number
  metalness: number
}

interface AnimationAction extends THREE.AnimationAction {
  _clip?: THREE.AnimationClip
}

type AnimationProps = {
  a: AnimationAction
  delay?: number
}

type AnimationConfig = {
  enter: AnimationProps
  loop?: AnimationProps
}

type Sections = 'intro' | 'hero' | 'portfolio' | 'about' | 'contact'

type AnimationConfigTypes = {
  current?: AnimationAction
  intro: AnimationConfig
  hero: AnimationConfig
  portfolio: AnimationConfig
  about: AnimationConfig
  contact: AnimationConfig
}

export default class Man {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  debug: Experience['debug']
  showLogs: boolean
  sizes: Experience['sizes']
  time: Experience['time']
  resource: LoadResult
  renderer: Experience['renderer']['instance']
  debugFolder: GUI | undefined
  model!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  material!: THREE.MeshStandardMaterial
  mesh!: THREE.Mesh
  debugObject!: DebugObject
  uniforms!: UniformsValue
  animation!: {
    mixer: THREE.AnimationMixer
    actions: AnimationConfigTypes
  }
  finishedAnimations: AnimationAction[]
  scroll: boolean

  constructor() {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.resource = this.resources.items.manModel
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.renderer = this.experience.renderer.instance

    this.scroll = false
    this.finishedAnimations = []

    this.debug = this.experience.debug
    this.showLogs = false

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Man')
    }

    this.debugObject = {
      roughness: 0.5,
      metalness: 1
    }

    this.setModel()
    this.setMaterial()
    this.setStoreEvents()

    gsap.delayedCall(0.5, this.startAnimations.bind(this))
  }

  setModel() {
    if (!this.resource.scene) return

    this.model = this.resource.scene
    this.scene.add(this.model)
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: 0xedd1ff,
      metalness: this.debugObject.metalness,
      roughness: this.debugObject.roughness,
      roughnessMap: this.resources.items.manRoughness as THREE.Texture
      // map: this.resources.items.manColor,
      // aoMap: this.resources.items.manAO,
      // normalMap: this.resources.items.manNormal,
      // metalnessMap: this.resources.items.manMetallic,
    })

    const manArmature = this.model.children.find(
      (child) => child.userData.name === 'Armature'
    )
    if (!manArmature) throw new Error("Man's Armature mesh not found")

    this.mesh = manArmature.children.find(
      (child) => child instanceof THREE.Mesh
    ) as THREE.Mesh

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, 'roughness')
        .min(0.01)
        .max(5)
        .step(0.01)
        .onChange(
          (v: DebugObject['roughness']) => (this.material.roughness = v)
        )
      this.debugFolder
        .add(this.debugObject, 'metalness')
        .min(0.01)
        .max(1)
        .step(0.01)
        .onChange(
          (v: DebugObject['metalness']) => (this.material.metalness = v)
        )
    }

    this.mesh.material = this.material
  }

  setStoreEvents() {
    const store = window.store
    let prevSection = store.getState().section.current

    store.subscribe(() => {
      const currentSection = store.getState().section.current as Sections
      if (currentSection !== prevSection) {
        if (!this.animation?.actions) {
          throw new Error('this.animation.actions not found in section handler')
        }

        const nextAnimation = this.animation.actions[currentSection]?.enter.a
        const prevAnimation = this.animation.actions.current

        if (prevAnimation?.isRunning()) {
          this.action('fade', nextAnimation, prevAnimation)
        } else {
          this.action('play', nextAnimation)
        }

        prevSection = currentSection
      }
    })
  }

  startAnimations() {
    if (!this.resource.animations?.length) {
      return
    }

    const mixer = new THREE.AnimationMixer(this.model)
    const globalAction = mixer.clipAction(this.resource.animations[0])
    const globalClip = globalAction.getClip()
    const subClip = THREE.AnimationUtils.subclip

    // Constrains
    // I.  The name "hero", "portfolio", ecc must be the same of the store.section
    // II. The first clipAction must be the Armature, the second the Camera
    this.animation = {
      mixer,
      actions: {
        intro: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'intro', 0, 80)),
            delay: 5
          }
        },
        hero: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'hero', 80, 160))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'hero.loop', 160, 240))
          }
        },
        portfolio: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'portfolio', 240, 320))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'portfolio.loop', 320, 400))
          }
        },
        about: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'about', 400, 450))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'about.loop', 450, 500))
          }
        },
        contact: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'contact', 500, 540))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'contact.loop', 540, 640))
          }
        }
      }
    }

    this.animation.mixer.addEventListener(
      'finished',
      this.handleAnimationFinish.bind(this)
    )

    // Start Intro animation
    this.action('play', this.animation.actions.intro.enter.a)

    // Debug
    if (this.debug.active && this.debugFolder) {
      const play = (name: Sections, type: 'enter' | 'loop' = 'enter') => {
        const animation = this.animation.actions[name]?.[type]?.a as
          | AnimationAction
          | undefined
        if (animation) {
          this.action('play', animation)
        }
      }
      const debugObject = {
        playIntro: () => play('intro'),
        playHero: () => play('hero'),
        playHeroLoop: () => play('hero', 'loop'),
        playPortfolio: () => play('portfolio')
      }

      this.debugFolder.add(debugObject, 'playIntro')
      this.debugFolder.add(debugObject, 'playHero')
      this.debugFolder.add(debugObject, 'playHeroLoop')
      this.debugFolder.add(debugObject, 'playPortfolio')
    }
  }

  handleAnimationFinish(event: THREE.Event) {
    const finishedAction = event.action
    const finishedClip = finishedAction.getClip()
    const finishedClipName = finishedClip.name
    const finishedName = this._getAnimationName(finishedClipName)
    const finishedType = this._getAnimationType(finishedClipName)

    // Always stop finished animation
    // But in order to avoid jumps to the first frame when the animation is stale,
    // Animations are pushed into an array and stopped on the next action()
    this.finishedAnimations.push(finishedAction)

    const heroAnimation = this.animation.actions.hero.enter.a as AnimationAction
    const loopAnimation = this.animation.actions[finishedName]?.loop?.a as
      | AnimationAction
      | undefined

    // Handle intro animation
    if (finishedName === 'intro') {
      this.action('play', heroAnimation)
    } else if (finishedType === 'enter' && loopAnimation) {
      // Handle loop animations
      this.action('play', loopAnimation)
    }

    // Handle scroll
    this.scroll = window.store.getState().scroll
    if (!this.scroll && finishedClipName === 'intro') {
      // Enable page scroll
      window.store.dispatch.scroll.canScroll()
    }
  }

  _getAnimationName(clipName: string): Sections {
    if (!this.animation.actions)
      throw new Error('No this.animation.actions found _getAnimationName()')

    for (const [name, animationGroup] of Object.entries(
      this.animation.actions
    )) {
      if (name === 'current') continue
      // name: intro
      // animationGroup: { enter: {...}, loop: {...} }
      for (const [status, animation] of Object.entries(animationGroup)) {
        // status: enter
        // animation: { a: <animation>, delay: 0.5, ... }
        const aniAction = animation.a as AnimationAction
        if (aniAction.getClip().name === clipName) {
          return name as Sections
        }
      }
    }

    throw new Error(`_getAnimationName cannot find name of ${clipName} clip`)
  }

  _getAnimationType(clipName: string): string {
    if (!this.animation.actions)
      throw new Error('No this.animation.actions found _getAnimationType()')

    for (const [name, animationGroup] of Object.entries(
      this.animation.actions
    )) {
      if (name === 'current') continue
      // name: intro
      // animationGroup: { enter: {...}, loop: {...} }
      for (const [status, animation] of Object.entries(animationGroup)) {
        // status: enter
        // animation: { a: <animation>, delay: 0.5, ... }
        // Both Armature and Camera animations are in the group
        const aniAction = animation.a as AnimationAction
        if (aniAction.getClip().name === clipName) {
          return status
        }
      }
    }

    throw new Error(`_getAnimationType cannot find type of ${clipName} clip`)
  }

  action(
    type = 'fade',
    animation: AnimationAction,
    prevAnimation?: AnimationAction
  ) {
    const thisClipName = animation.getClip().name
    const thisAnimationName = this._getAnimationName(thisClipName) as Sections
    const thisAnimationType = this._getAnimationType(thisClipName) as
      | 'enter'
      | 'loop'

    if (!thisAnimationName || !thisAnimationType) {
      throw new Error(
        'action() is not able to identify the animation name or type'
      )
    }

    animation.reset()

    if (!thisClipName.includes('loop')) {
      animation.clampWhenFinished = true
      animation.setLoop(THREE.LoopOnce, 1)
    }

    if (type === 'play') {
      if (this.showLogs) console.log(`${thisClipName} play()`)

      animation.play()
    } else if (type === 'fade' && prevAnimation) {
      if (this.showLogs)
        console.log(
          `${thisClipName} crossFadeFrom(${prevAnimation.getClip().name})`
        )

      animation.crossFadeFrom(prevAnimation, 1, true).play()
    }

    // Stop finished animation
    for (const finishedAnimation of this.finishedAnimations) {
      requestAnimationFrame(() => {
        if (this.showLogs)
          console.log(`${finishedAnimation.getClip().name} stop()`)
        finishedAnimation.stop()
      })
    }
    this.finishedAnimations = []

    // Set Current Animation
    if (!this.animation?.actions)
      throw new Error('No this.animation.actions found in action()')

    this.animation.actions.current = animation
  }

  update() {
    const delta = this.time.delta * 0.001
    this.animation?.mixer?.update?.(delta)

    // if (this.uniforms) {
    //   this.uniforms.u_time.value += delta * 0.05;
    // }
  }
}

/*
setMaterial() {
  this.controllers = {
    roughness: 0.5,
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
    iterations: { value: 8 },
    depth: { value: 1.9 },
    smoothing: { value: 0.2 },
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
    displacement: { value: 3.0 },
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
          // @param p - Point to displace
          // @param strength - How much the map can displace the point
          // @returns Point with scrolling displacement applied
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

            // * @param rayOrigin - Point on sphere
            // * @param rayDir - Normalized ray direction
            // * @returns Diffuse RGB color
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
*/
