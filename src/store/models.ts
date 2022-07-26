import { Models } from '@rematch/core'

// Models
import { app } from './models/app'
import { menu } from './models/menu'
import { scroll } from './models/scroll'
import { section } from './models/section'
import { sizes } from './models/sizes'

export interface RootModel extends Models<RootModel> {
  app: typeof app
  menu: typeof menu
  scroll: typeof scroll
  section: typeof section
  sizes: typeof sizes
}

export const models: RootModel = { app, menu, scroll, section, sizes }
