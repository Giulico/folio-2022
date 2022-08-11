// Classes & Settings
import { showPortfolio } from 'settings'
import Experience from '../Experience'
import Environment from './Environment'
import Man from './Man'
import Smoke from './Smoke'
import Portfolio from './Portfolio'
import CameraOnPath from './CameraOnPath'

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
      this.man = new Man()
      // this.smoke = new Smoke();
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
