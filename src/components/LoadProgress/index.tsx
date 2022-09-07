// Types
import type { RootState } from 'store'

// Utils
import cn from 'classnames'

// Style
import style from './index.module.css'

// Hooks
import { useSelector } from 'react-redux'

import { showExperience } from 'settings'

function LoadProgress() {
  const app = useSelector((state: RootState) => state.app)

  const classes = cn(style.root, {
    // [style.loaded]: app.loadingProgress === 1
  })

  return showExperience ? (
    <div className={classes}>
      <div
        className={style.bar}
        style={{
          transform: app.loadingProgress < 1 ? `scaleX(${app.loadingProgress})` : undefined
        }}
      />
    </div>
  ) : null
}

export default LoadProgress
