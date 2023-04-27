// Classes & Settings
import {
  showPortfolio,
  showMan,
  showTitles,
  showStrikes,
  showClouds,
  showParticles
} from 'settings'
import Experience from '../Experience'
import Environment from './Environment'
import Man from './Man'
import Smoke from './Smoke'
import Portfolio from './Portfolio'
import CameraOnPath from './CameraOnPath'
import Image from './Image'
import Title from './Title'
import Strikes from './Strikes'
import Clouds from './Clouds'
import Particles from './Particles'
import Floor from './Floor'

// Utils
import { fontLoader } from 'utils/fonts'
import { arrayEquals } from 'utils/arrays'

type ImageProps = {
  name: string
  sizes: [number, number]
}

export default class World {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  cameraOnPath: CameraOnPath
  man: Man | undefined
  smoke: Smoke | undefined
  environment: Environment | undefined
  portfolio: Portfolio | undefined
  images: Image[]
  titles: Title[]
  strikes!: Strikes
  clouds!: Clouds
  particles!: Particles
  floor!: Floor

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.titles = []
    this.images = []

    this.cameraOnPath = new CameraOnPath()

    const store = window.store
    let prevBoundaries: any[] = []

    store.subscribe(() => {
      const boundaries = store.getState().section.boundaries

      if (!arrayEquals(boundaries, prevBoundaries)) {
        for (let i = 0; i < boundaries.length; i++) {
          if (this.titles?.[i]) {
            this.titles[i].pageYPosition = boundaries[i].start
          }
        }

        prevBoundaries = boundaries
      }
    })

    // Listeners
    this.resources.on('ready', async () => {
      const dispatch = store.dispatch
      const state = store.getState()
      const images: { [key: string]: ImageProps } = state.images

      // this.floor = new Floor()

      for (const name of Object.keys(images)) {
        const image = new Image({
          name,
          sizes: images[name].sizes
        })
        this.images.push(image)
      }

      // Strikes and lighting
      if (showStrikes) {
        this.strikes = new Strikes()
      }

      // Strikes and lighting
      if (showClouds) {
        this.clouds = new Clouds()
      }

      if (showParticles) {
        this.particles = new Particles()
      }

      // Setup
      this.environment = new Environment()

      // Man
      if (showMan) {
        this.man = new Man()
      } else {
        await fontLoader()

        dispatch.app.setReady()
        dispatch.scroll.canScroll()
      }

      // Portfolio
      if (showPortfolio) {
        this.portfolio = new Portfolio()
      }

      // Titles
      if (showTitles) {
        this.titles = state.section.sections.map(({ name }, index) => {
          return new Title({ itemIndex: index, text: name })
        })
      }
    })
  }

  resize() {
    this.man?.resize?.()
    this.cameraOnPath?.resize?.()
    this.portfolio?.resize?.()
    this.clouds?.resize?.()

    for (const title of this.titles) {
      title?.resize?.()
    }
  }

  update() {
    this.man?.update?.()
    this.smoke?.update?.()
    this.portfolio?.update?.()
    this.cameraOnPath?.update?.()
    this.strikes?.update?.()
    this.clouds?.update?.()
    this.particles?.update?.()
    // this.floor?.update?.()

    for (const image of this.images) {
      image?.update?.()
    }

    for (const title of this.titles) {
      title?.update?.()
    }
  }
}
