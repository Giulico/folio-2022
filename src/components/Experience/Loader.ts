// Utils
import { gsap } from 'gsap'
import { fontLoader } from 'utils/fonts'

// Components
import Experience from './Experience'

export default class Loader {
  experience: Experience

  constructor() {
    this.experience = new Experience()

    Promise.all([this.fontLoader(), this.resourcesLoader()]).then(() => {
      window.store.dispatch.app.setReady()
    })
  }

  fontLoader() {
    return new Promise((resolve) => {
      fontLoader()
        .then(() => {
          resolve(null)
        })
        .catch(console.log)
    })
  }

  resourcesLoader() {
    return new Promise((resolve) => {
      const resources: Experience['resources'] = this.experience.resources

      resources.on('ready', () => {
        resolve(null)
      })

      resources.on('progress', (...args: any[]) => {
        const [url, loaded, total] = args
        // Waiting 0.5 seconds because of the css transition on the loader
        gsap.delayedCall(0.5, () => {
          window.store.dispatch.app.setLoadingProgress(loaded / total)
        })
      })
    })
  }
}
