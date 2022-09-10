import { Models } from '@rematch/core'

// Models
import { app } from './models/app'
import { images } from './models/images'
import { menu } from './models/menu'
import { pointer } from './models/pointer'
import { scroll } from './models/scroll'
import { section } from './models/section'
import { sizes } from './models/sizes'

export interface RootModel extends Models<RootModel> {
  app: typeof app
  images: typeof images
  menu: typeof menu
  pointer: typeof pointer
  scroll: typeof scroll
  section: typeof section
  sizes: typeof sizes
}

export const models: RootModel = { app, images, menu, scroll, section, sizes, pointer }
