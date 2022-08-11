// Types
import type { AnimationEvent } from 'react'
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Logo() {
  const location = useLocation()
  const [closingModal, setClosingModal] = useState(false)
  const currentPathname = useRef<string>(location.pathname)
  const app = useSelector((state: RootState) => state.app)

  const classes = cn(style.root, {
    [style.hidden]: !app.ready,
    [style.toWhite]: app.ready && closingModal,
    [style.toBlack]: app.ready && location.pathname !== '/'
  })

  const endAnimationHandler = useCallback((e: AnimationEvent) => {
    if (e.animationName === style['to-white']) {
      setClosingModal(false)
    }
  }, [])

  useEffect(() => {
    if (currentPathname.current !== location.pathname && location.pathname === '/') {
      setClosingModal(true)
    }
    currentPathname.current = location.pathname
  }, [closingModal, location.pathname])

  return (
    <div className={classes}>
      <span className={style.light}>
        <span className={style.inner} onAnimationEnd={endAnimationHandler}>
          They
        </span>
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
