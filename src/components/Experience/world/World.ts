// Classes & Settings
import { showPortfolio, showMan, showTitles, showStrikes, showClouds } from 'settings'
import Experience from '../Experience'
import Environment from './Environment'
import Man from './Man'
import Smoke from './Smoke'
import Portfolio from './Portfolio'
import CameraOnPath from './CameraOnPath'
import Title from './Title'
import Strikes from './Strikes'
import Clouds from './Clouds'

// Utils
import { fontLoader } from 'utils/fonts'
import { arrayEquals } from 'utils/arrays'

export default class World {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  cameraOnPath: CameraOnPath
  man: Man | undefined
  smoke: Smoke | undefined
  environment: Environment | undefined
  portfolio: Portfolio | undefined
  titles: Title[]
  strikes!: Strikes
  clouds!: Clouds

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.titles = []

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

      // Strikes and lighting
      if (showStrikes) {
        this.strikes = new Strikes()
      }

      // Strikes and lighting
      if (showClouds) {
        this.clouds = new Clouds()
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
        this.titles = [
          new Title({ itemIndex: 0, text: 'TCMG' }),
          new Title({ itemIndex: 1, text: 'Portfolio' }),
          new Title({ itemIndex: 2, text: 'About' }),
          new Title({ itemIndex: 3, text: 'Contact' })
        ]
      }
    })
  }

  resize() {
    this.man?.resize?.()
    this.cameraOnPath?.resize?.()
  }

  update() {
    this.man?.update?.()
    this.smoke?.update?.()
    this.portfolio?.update?.()
    this.cameraOnPath?.update?.()
    this.strikes?.update?.()
    this.clouds?.update?.()

    for (const title of this.titles) {
      title?.update?.()
    }
  }
}
