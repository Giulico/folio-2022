// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import MenuTrigger from '../MenuTrigger'

// Hooks
import { useLocation } from 'react-router-dom'

function Menu() {
  const location = useLocation()
  const classes = cn({
    [style.hidden]: location.pathname !== '/'
  })

  return (
    <div className={classes}>
      <p className={style.desc}>
        <span className={style.line}>35yo</span>
      </p>
      <p className={style.desc}>
        <span className={style.line}>Switzerland, Lugano</span>
      </p>
      <hr className={style.separator} />
      <MenuTrigger />
    </div>
  )
}

export default Menu
