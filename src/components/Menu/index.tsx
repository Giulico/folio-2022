// Types
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import MenuTrigger from '../MenuTrigger'

// Hooks
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Menu() {
  const location = useLocation()
  const app = useSelector((state: RootState) => state.app)

  const classes = cn({
    [style.hidden]: !app.ready || location.pathname !== '/'
  })

  return (
    <div className={classes}>
      <p className={style.desc}>
        <span className={style.line}>35yo</span>
      </p>
      <p className={style.desc}>
        <span className={style.line}>Creative Technologist</span>
      </p>
      <hr className={style.separator} />
      <MenuTrigger />
    </div>
  )
}

export default Menu
