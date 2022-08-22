import * as THREE from 'three'
import { gsap } from 'gsap'

// Shaders
import cnoise from './shaders/perlin.glsl?raw'

// Types
import type { GUI } from 'lil-gui'
import type { LoadResult } from '../utils/Resources'
import type { RootState } from 'store'

// Classes & Settings
import { showManAnimationLogs } from 'settings'
import Experience from '../Experience'
import StoreWatcher from '../utils/StoreWatcher'

type Uniforms = {
  uTime: number
  uBigWavesElevation: number
  uBigWavesFrequency: THREE.Vector2
  uBigWavesSpeed: number
  uDepthColor: THREE.Color
  uSurfaceColor: THREE.Color
  uColorOffset: number
  uColorMultiplier: number
}

type UniformsValue = {
  [P in keyof Uniforms]: { value: Uniforms[P] }
}

type DebugObject = {
  roughness: number
  metalness: number
  uBigWavesElevation: number
  uBigWavesFrequency: THREE.Vector2
  uBigWavesSpeed: number
  uDepthColor: THREE.Color
  uSurfaceColor: THREE.Color
  uColorOffset: number
  uColorMultiplier: number
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

type AnimationConfigTypes = {
  current?: AnimationAction
  intro: AnimationConfig
  hero: AnimationConfig
  portfolio: AnimationConfig
  about: AnimationConfig
  contact: AnimationConfig
  menu: AnimationConfig
}

export default class Man {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  debug: Experience['debug']
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
  animationBeforeMenuOpen!: AnimationAction
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

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Man')
    }

    this.debugObject = {
      roughness: 0.46,
      metalness: 1,
      uBigWavesElevation: 0.06,
      uBigWavesFrequency: new THREE.Vector2(0.01, 0.01),
      uBigWavesSpeed: 0.52,
      uDepthColor: new THREE.Color('#252e46'),
      uSurfaceColor: new THREE.Color('#667fa9'),
      uColorOffset: 0.48,
      uColorMultiplier: 3.85
    }

    this.setModel()
    this.setMaterial()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))

    gsap.delayedCall(0.5, this.startAnimations.bind(this))
  }

  setModel() {
    if (!this.resource.scene) return

    this.model = this.resource.scene
    this.scene.add(this.model)
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      // color: 0xedd1ff,
      // metalness: this.debugObject.metalness,
      // roughness: this.debugObject.roughness,
      envMap: this.resources.items.envMap as THREE.Texture
      // roughnessMap: this.resources.items.manRoughness as THREE.Texture,
      // map: this.resources.items.manColor as THREE.Texture,
      // aoMap: this.resources.items.manAO as THREE.Texture,
      // normalMap: this.resources.items.manNormal as THREE.Texture,
      // metalnessMap: this.resources.items.manMetallic as THREE.Texture
    })

    this.uniforms = {
      uTime: { value: this.time.elapsed },
      uBigWavesElevation: { value: this.debugObject.uBigWavesElevation },
      uBigWavesFrequency: { value: this.debugObject.uBigWavesFrequency },
      uBigWavesSpeed: { value: this.debugObject.uBigWavesSpeed },
      uDepthColor: { value: this.debugObject.uDepthColor },
      uSurfaceColor: { value: this.debugObject.uSurfaceColor },
      uColorOffset: { value: this.debugObject.uColorOffset },
      uColorMultiplier: { value: this.debugObject.uColorMultiplier }
    }

    this.resources.items.manHeight.wrapS = THREE.RepeatWrapping
    this.resources.items.manHeight.wrapT = THREE.RepeatWrapping

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms = { ...shader.uniforms, ...this.uniforms }

      // Add to top of vertex shader
      shader.vertexShader =
        `
          uniform float uTime;
          uniform float uBigWavesElevation;
          uniform vec2 uBigWavesFrequency;
          uniform float uBigWavesSpeed;

          // uniform float uSmallWavesElevation;
          // uniform float uSmallWavesFrequency;
          // uniform float uSmallWavesSpeed;
          // uniform float uSmallWavesIteration;

          uniform sampler2D heightMap;

          varying float vElevation;
          varying float vAmount;
          
          ${cnoise}
        ` + shader.vertexShader

      shader.vertexShader = shader.vertexShader.replace(
        /void main\(\) {/,
        (match) =>
          match +
          `
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            // float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) 
            //   * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
            //   * uBigWavesElevation;
            
            // for (float i = 1.0; i <= uSmallWavesIteration; i++) {
            //   elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
            // }

            vElevation = sin(modelPosition.z * uBigWavesFrequency.x + uTime * uBigWavesSpeed)
              * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
              * uBigWavesElevation;
          `
      )

      shader.fragmentShader =
        `
          uniform vec3 uDepthColor;
          uniform vec3 uSurfaceColor;

          uniform float uColorOffset;
          uniform float uColorMultiplier;

          uniform vec3 uFogColor;
          uniform float uFogNear;
          uniform float uFogFar;

          uniform sampler2D heightMap;

          varying float vElevation;
          varying float vAmount;
        ` + shader.fragmentShader

      shader.fragmentShader = shader.fragmentShader.replace(
        /vec4 diffuseColor.*;/,
        (match) =>
          match +
          `
            float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
            vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
            diffuseColor = vec4(color, 1.0);
          `
      )
    }

    const manArmature = this.model.children.find((child) => child.userData.name === 'Armature')
    if (!manArmature) throw new Error("Man's Armature mesh not found")

    this.mesh = manArmature.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, 'roughness')
        .min(0.01)
        .max(5)
        .step(0.01)
        .onChange(() => (this.material.roughness = this.debugObject.roughness))
      this.debugFolder
        .add(this.debugObject, 'metalness')
        .min(0.01)
        .max(1)
        .step(0.01)
        .onChange(() => (this.material.metalness = this.debugObject.metalness))
      // Waves
      this.debugFolder
        .add(this.debugObject, 'uBigWavesElevation')
        .min(0.01)
        .max(1.0)
        .step(0.01)
        .name('Big Waves Elevation')
        .onChange(() => {
          this.uniforms.uBigWavesElevation.value = this.debugObject.uBigWavesElevation
        })
      this.debugFolder
        .add(this.debugObject.uBigWavesFrequency, 'x')
        .min(0.01)
        .max(10.0)
        .step(0.01)
        .name('Big Waves Frequency x')
        .onChange(() => {
          this.uniforms.uBigWavesFrequency.value.x = this.debugObject.uBigWavesFrequency.x
        })
      this.debugFolder
        .add(this.debugObject.uBigWavesFrequency, 'y')
        .min(0.01)
        .max(10.0)
        .step(0.01)
        .name('Big Waves Frequency y')
        .onChange(() => {
          this.uniforms.uBigWavesFrequency.value.y = this.debugObject.uBigWavesFrequency.y
        })
      this.debugFolder
        .add(this.debugObject, 'uBigWavesSpeed')
        .min(0.01)
        .max(5.0)
        .step(0.01)
        .name('Big Waves Speed')
        .onChange(() => {
          this.uniforms.uBigWavesSpeed.value = this.debugObject.uBigWavesSpeed
        })
      this.debugFolder
        .addColor(this.debugObject, 'uDepthColor')
        .name('Depth Color')
        .onChange(() => {
          this.uniforms.uDepthColor.value.set(this.debugObject.uDepthColor)
        })
      this.debugFolder
        .addColor(this.debugObject, 'uSurfaceColor')
        .name('Surface Color')
        .onChange(() => {
          this.uniforms.uSurfaceColor.value.set(this.debugObject.uSurfaceColor)
        })
      this.debugFolder
        .add(this.debugObject, 'uColorOffset')
        .min(0)
        .max(1)
        .step(0.01)
        .name('Color Offset')
        .onChange(() => {
          this.uniforms.uColorOffset.value = this.debugObject.uColorOffset
        })
      this.debugFolder
        .add(this.debugObject, 'uColorMultiplier')
        .min(0)
        .max(10)
        .step(0.01)
        .name('Color Multiplier')
        .onChange(() => {
          this.uniforms.uColorMultiplier.value = this.debugObject.uColorMultiplier
        })
    }

    this.mesh.material = this.material
    this.mesh.layers.set(1)
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    const prevSection = prevState.section.current

    const currentSection = state.section.current as Sections
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
    }

    // Menu
    if (state.menu.open !== prevState.menu.open) {
      const menuAnimation = this.animation.actions.menu.enter.a
      const currentAnimation = this.animation.actions.current
      if (state.menu.open) {
        this.animationBeforeMenuOpen = currentAnimation as AnimationAction
        this.action('fade', menuAnimation, currentAnimation)
      } else {
        this.action('fade', this.animationBeforeMenuOpen, menuAnimation)
      }
    }
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
            a: mixer.clipAction(subClip(globalClip, 'hero', 80, 260))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'hero.loop', 260, 610))
          }
        },
        portfolio: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'portfolio', 610, 690))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'portfolio.loop', 690, 770))
          }
        },
        about: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'about', 770, 820))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'about.loop', 820, 870))
          }
        },
        contact: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'contact', 870, 910))
          },
          loop: {
            a: mixer.clipAction(subClip(globalClip, 'contact.loop', 910, 1060))
          }
        },
        menu: {
          enter: {
            a: mixer.clipAction(subClip(globalClip, 'menu.loop', 1060, 1150))
          }
        }
      }
    }

    this.animation.mixer.addEventListener('finished', this.handleAnimationFinish.bind(this))

    // Start Intro animation
    this.action('play', this.animation.actions.intro.enter.a)

    // Debug
    if (this.debug.active && this.debugFolder) {
      const play = (name: Sections, type: 'enter' | 'loop' = 'enter') => {
        const animation = this.animation.actions[name]?.[type]?.a as AnimationAction | undefined
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

    // Check if the finished animation is already fading out. If so, return with no action.
    // This can happen if user scroll quickly up and down and reach the end while user is in another section
    if (finishedAction.getEffectiveWeight() < 1) {
      return
    }

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

  action(type = 'fade', animation: AnimationAction, prevAnimation?: AnimationAction) {
    const thisClipName = animation.getClip().name
    const thisAnimationName = this._getAnimationName(thisClipName) as Sections
    const thisAnimationType = this._getAnimationType(thisClipName) as 'enter' | 'loop'

    if (!thisAnimationName || !thisAnimationType) {
      throw new Error('action() is not able to identify the animation name or type')
    }

    animation.reset()

    if (!thisClipName.includes('loop')) {
      animation.clampWhenFinished = true
      animation.setLoop(THREE.LoopOnce, 1)
    }

    if (type === 'play') {
      if (showManAnimationLogs) console.log(`${thisClipName} play()`)

      animation.play()
    } else if (type === 'fade' && prevAnimation) {
      if (showManAnimationLogs)
        console.log(`${thisClipName} crossFadeFrom(${prevAnimation.getClip().name})`)

      animation.crossFadeFrom(prevAnimation, 1, false).play()
    }

    // Stop finished animation
    for (const finishedAnimation of this.finishedAnimations) {
      requestAnimationFrame(() => {
        if (showManAnimationLogs) console.log(`${finishedAnimation.getClip().name} stop()`)
        finishedAnimation.stop()
      })
    }
    this.finishedAnimations = []

    // Set Current Animation
    if (!this.animation?.actions) throw new Error('No this.animation.actions found in action()')

    this.animation.actions.current = animation
  }

  _getAnimationName(clipName: string): Sections {
    if (!this.animation.actions)
      throw new Error('No this.animation.actions found _getAnimationName()')

    for (const [name, animationGroup] of Object.entries(this.animation.actions)) {
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

    for (const [name, animationGroup] of Object.entries(this.animation.actions)) {
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

  update() {
    const delta = this.time.delta * 0.001
    this.animation?.mixer?.update?.(delta)

    if (this.uniforms) {
      this.uniforms.uTime.value = this.time.clockElapsed
    }
  }

  resize() {
    // Resize handler
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
