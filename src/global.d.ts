import type Experience from 'components/Experience/Experience'
import type { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import type { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
export {}

type Cursor = {
  x: number
  y: number
}

declare global {
  type Sections = 'intro' | 'hero' | 'portfolio' | 'about' | 'contact'

  interface Window {
    cursor: Cursor
    experience: Experience
    store: any
    comingLocation: any
    currentLocation: any
  }

  interface BloomPassExtended extends BloomPass {
    combineUniforms?: { [key: string]: { value: any } }
  }

  interface FilmPassExtended extends FilmPass {
    uniforms?: { [key: string]: { value: any } }
  }
}
