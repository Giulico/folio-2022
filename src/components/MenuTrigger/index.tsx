// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'
import breakpoints from 'utils/breakpoints'

// Hooks
import useMainMenu from 'hooks/useMainMenu'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

const MenuTrigger = () => {
  const dispatch = useDispatch()

  const { menu } = useSelector((state: RootState) => ({
    menu: state.menu,
    sizes: state.sizes
  }))

  // Main Menu Effects
  useMainMenu()

  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })

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

  const classes = cn(style.root, {
    [style.open]: menu.open
  })

  return (
    <button className={classes} onMouseDown={openMenu} onTouchStart={openMenu}>
      {menu.open ? 'Close' : 'Menu'}

      <div className={style.start}></div>
      <div className={style.line} />
      <div className={style.end}></div>
    </button>
  )
}
export default MenuTrigger
