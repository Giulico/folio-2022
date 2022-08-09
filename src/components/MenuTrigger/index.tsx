import React from 'react'

// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'
import breakpoints from 'utils/breakpoints'
import { gsap } from 'gsap'

// Hooks
import useMainMenu from 'hooks/useMainMenu'
import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

const MenuTrigger = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const { menu, sizes } = useSelector((state: RootState) => ({
    menu: state.menu,
    sizes: state.sizes
  }))

  // Main Menu Effects
  useMainMenu()

  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })
  const circleEl = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(
    (event: MouseEvent | TouchEvent) => {
      window.removeEventListener('mouseup', closeMenu)
      window.removeEventListener('touchend', closeMenu)

      const eventType = isDesktop ? 'mouseup' : 'touchend'
      if (event.type !== eventType) return

      dispatch.menu.open(false)
    },
    [dispatch.menu, isDesktop]
  )

  const openMenu = useCallback(
    (event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<HTMLButtonElement>) => {
      const eventType = isDesktop ? 'mousedown' : 'touchstart'
      if (event.type !== eventType) return

      dispatch.menu.open(true)

      window.addEventListener('mouseup', closeMenu)
      window.addEventListener('touchend', closeMenu)
    },
    [closeMenu, dispatch.menu, isDesktop]
  )

  const syncYAxe = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!circleEl.current) return

      const elY = e.y || e.touches[0].clientY
      const targetY = elY - menu.triggerY - 25
      const y =
        elY < menu.triggerY + 25
          ? 0
          : elY > sizes.height - menu.triggerY - 25
          ? sizes.height - menu.triggerY * 2 - 25
          : targetY

      gsap.to(circleEl.current, {
        y: `${y}px`,
        duration: 0.3,
        ease: 'power2.out'
      })
    },
    [menu.triggerY, sizes.height]
  )

  useEffect(() => {
    if (menu.open) {
      window.addEventListener('mousemove', syncYAxe)
      window.addEventListener('touchmove', syncYAxe)
    } else {
      window.removeEventListener('mousemove', syncYAxe)
      window.removeEventListener('touchmove', syncYAxe)
    }
  }, [menu.open, syncYAxe])

  useEffect(() => {
    if (circleEl.current) {
      console.log(circleEl.current.getBoundingClientRect().top)
      dispatch.menu.setTriggerY(circleEl.current.getBoundingClientRect().top)
    }
  }, [dispatch.menu, sizes.height])

  const classes = cn(style.root, {
    [style.open]: menu.open,
    [style.hidden]: location.pathname !== '/'
  })

  return (
    <div className={classes}>
      <button className={style.button} onMouseDown={openMenu} onTouchStart={openMenu}>
        <div className={style.circle} ref={circleEl} />
        <div className={style.label}>
          <span>{menu.open ? 'Close' : 'Menu'}</span>
        </div>

        <div className={style.start}></div>
        <div className={style.line} />
        <div className={style.end}></div>
      </button>
    </div>
  )
}
export default MenuTrigger
