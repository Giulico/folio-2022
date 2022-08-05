// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useLocation } from 'react-router-dom'

function Logo() {
  const location = useLocation()

  const classes = cn(style.root, {
    [style.lightBg]: location.pathname !== '/'
  })

  return (
    <div className={classes}>
      <span className={style.light}>
        <span className={style.inner}>They</span>
      </span>
      <span className={style.light}>
        <span className={style.inner}>call me</span>
      </span>
      <span className={style.bold}>
        <span className={style.inner}>Giulio</span>
      </span>
    </div>
  )
}

export default Logo
