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
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

function Menu() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const app = useSelector((state: RootState) => state.app)

  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 500)
  }, [])

  const isHome = location.pathname === '/'

  const classes = cn({
    [style.hidden]: !visible || !isHome
  })

  const separatorClasses = cn(style.separator, {
    [style.hidden]: !app.ready && isHome
  })

  return (
    <div className={classes}>
      <p className={style.desc}>
        <span className={style.line}>v4.0</span>
      </p>
      <p className={style.desc}>
        <span className={style.line}>2003 — 2023</span>
      </p>
      <hr className={separatorClasses} />
      <MenuTrigger />
    </div>
  )
}

export default Menu
