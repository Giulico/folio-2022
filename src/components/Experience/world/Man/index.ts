import * as THREE from 'three'

// Types
import type { LoadResult } from '../../utils/Resources'
import type { RootState } from 'store'

// Classes & Settings
import { showManAnimationLogs, manMaterial } from 'settings'
import Experience from '../../Experience'
import StoreWatcher from '../../utils/StoreWatcher'

// Materials
import magicalMarble from './materials/MagicalMarble'
import glow from './materials/Glow'
import outline from './materials/Outline'
import lambert from './materials/Lambert'
import vibrant from './materials/Vibrant'

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
  sizes: Experience['sizes']
  time: Experience['time']
  resource: LoadResult
  renderer: Experience['renderer']['instance']
  model!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  mesh!: THREE.Mesh
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

    this.setModel()
    this.setMaterial()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  setModel() {
    if (!this.resource.scene) return

    this.model = this.resource.scene
    this.scene.add(this.model)
  }

  setMaterial() {
    const materialName = manMaterial as string
    let material!: (THREE.MeshStandardMaterial | THREE.ShaderMaterial | THREE.MeshBasicMaterial)[]

    switch (materialName) {
      case 'magicalMarble':
        material = magicalMarble()
        break

      case 'glow':
        material = glow()
        break

      case 'outline':
        material = outline()
        break

      case 'lambert':
        material = lambert()
        break

      case 'vibrant':
        material = vibrant()
        break

      default:
        material = [new THREE.MeshStandardMaterial({ color: 0x398424 })]
        break
    }

    const manArmature = this.model.children.find((child) => child.userData.name === 'Armature')
    if (!manArmature) throw new Error("Man's Armature mesh not found")

    this.mesh = manArmature.children.find(
      (child) => child instanceof THREE.SkinnedMesh
    ) as THREE.SkinnedMesh

    this.mesh.castShadow = false
    this.mesh.receiveShadow = false
    this.mesh.material = material

    if (materialName === 'outline') {
      const geom = this.mesh.geometry

      if (geom.index) {
        geom.addGroup(0, Infinity, 0)
        geom.addGroup(0, geom.index.count, 1)
        geom.addGroup(0, Infinity, 2)
      }
    } else {
      this.mesh.material = material[0]
    }

    if (materialName === 'lambert') {
      this.mesh.layers.enable(1)
    }
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    // App ready - starting animation
    if (state.app.ready && !prevState.app.ready) {
      // gsap.delayedCall(0.5, this.startAnimations.bind(this))
      this.startAnimations()
    }

    // Change section
    const prevSection = prevState.section.current
    const currentSection = state.section.current as Sections
    if (currentSection !== prevSection) {
      if (!this.animation?.actions) {
        throw new Error('this.animation.actions not found in section handler')
      }

      const nextAnimation = this.animation.actions[currentSection]?.enter.a
      const prevAnimation = this.animation.actions.current

      // console.log('Trigger new action due to section.current changed to', currentSection)
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
        const state = window.store.getState()
        const sections = state.section.sections
        const nextSectionIndex = state.menu.index
        const nextSectionId = sections[nextSectionIndex].id as Sections

        // console.log(`Trova l'animazione di ${nextSectionId} e esegui lei`)
        this.action('fade', this.animation.actions[nextSectionId]?.enter.a, menuAnimation)
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
            a: mixer.clipAction(subClip(globalClip, 'intro', 0, 80))
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
      setTimeout(() => {
        this.action('play', heroAnimation)
      }, 300)
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
  }

  resize() {
    // Resize handler
  }
}
