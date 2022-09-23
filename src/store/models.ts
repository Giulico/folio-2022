import { Models } from '@rematch/core'

// Models
import { app } from './models/app'
import { audio } from './models/audio'
import { images } from './models/images'
import { menu } from './models/menu'
import { pointer } from './models/pointer'
import { projects } from './models/projects'
import { scroll } from './models/scroll'
import { section } from './models/section'
import { sizes } from './models/sizes'

export interface RootModel extends Models<RootModel> {
  app: typeof app
  audio: typeof audio
  images: typeof images
  menu: typeof menu
  pointer: typeof pointer
  projects: typeof projects
  scroll: typeof scroll
  section: typeof section
  sizes: typeof sizes
}

export const models: RootModel = {
  app,
  audio,
  images,
  menu,
  pointer,
  projects,
  scroll,
  section,
  sizes
}
