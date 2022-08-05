import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'

import { createBrowserHistory } from 'history'

export const history = createBrowserHistory({ window })

const store = init({ models })
window.store = store

export default store

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
