import type { Location } from 'history'
import type { Store } from 'store'
import type Experience from 'components/Experience/Experience'
import type { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import type { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
export {}

type Cursor = {
  x: number
  y: number
}
type CursorNormalized = {
  x: number
  y: number
}

declare global {
  type Sections = 'intro' | 'hero' | 'portfolio' | 'about' | 'contact'

  interface Window {
    cursor: Cursor
    cursorNormalized: CursorNormalized
    experience: Experience
    store: Store
    comingLocation: Location
    currentLocation: Location
  }

  interface BloomPassExtended extends BloomPass {
    combineUniforms?: { [key: string]: { value: any } }
  }

  interface FilmPassExtended extends FilmPass {
    uniforms?: { [key: string]: { value: any } }
  }
}
