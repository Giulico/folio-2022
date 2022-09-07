import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Hooks
import { useSelector } from 'react-redux'

// Utils
import cn from 'classnames'

function AudioWave() {
  const app = useSelector((state: RootState) => state.app)

  const classes = cn(style.wave, {
    [style.hidden]: !app.ready
  })

  return (
    <div className={classes}>
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
    </div>
  )
}

export default AudioWave
