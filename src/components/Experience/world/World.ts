// Classes & Settings
import { showPortfolio, showMan } from 'settings'
import Experience from '../Experience'
import Environment from './Environment'
import Man from './Man'
import Smoke from './Smoke'
import Portfolio from './Portfolio'
import CameraOnPath from './CameraOnPath'

// Utils
import { fontLoader } from 'utils/fonts'

export default class World {
  experience: Experience
  scene: Experience['scene']
  resources: Experience['resources']
  cameraOnPath: CameraOnPath
  man: Man | undefined
  smoke: Smoke | undefined
  environment: Environment | undefined
  portfolio: Portfolio | undefined

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.cameraOnPath = new CameraOnPath()

    // Listeners
    this.resources.on('ready', () => {
      // Setup
      this.environment = new Environment()
      if (showMan) {
        this.man = new Man()
      } else {
        fontLoader().then(() => {
          window.store.dispatch.app.setReady()
          window.store.dispatch.scroll.canScroll()
        })
      }
      if (showPortfolio) {
        this.portfolio = new Portfolio()
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
  }
}
