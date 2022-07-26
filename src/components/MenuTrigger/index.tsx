// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'

// Hooks
import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

const MenuTrigger = () => {
  const dispatch = useDispatch()
  const { menu, sizes } = useSelector((state: RootState) => ({
    menu: state.menu,
    sizes: state.sizes
  }))

  const minWidth = useMemo(
    () =>
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--lg'),
        10
      ),
    []
  )
  const isDesktop = useMediaQuery({ minWidth })

  const openMenu = useCallback(
    (
      event:
        | React.MouseEvent<Element, MouseEvent>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      const eventType = isDesktop ? 'mousedown' : 'touchstart'
      if (event.type !== eventType) return

      dispatch.menu.open(true)

      const bounding = menu.refs.map((e) => e.getBoundingClientRect().top)

      const snap = sizes.height / menu.refs.length
      for (let i = 0; i < menu.refs.length; i++) {
        const menuItem = menu.refs[i]
        gsap.to(menuItem, {
          y: `${snap * i - bounding[i]}px`,
          duration: 1,
          ease: 'power3.out'
        })
      }
    },
    [menu, sizes]
  )

  const closeMenu = useCallback(
    (
      event:
        | React.MouseEvent<Element, MouseEvent>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      const eventType = isDesktop ? 'mouseup' : 'touchend'
      if (event.type !== eventType) return

      dispatch.menu.open(false)

      for (let i = 0; i < menu.refs.length; i++) {
        const menuItem = menu.refs[i]
        gsap.to(menuItem, {
          y: `0px`,
          onComplete: () => {
            gsap.set(menuItem, { clearProps: 'all' })
          },
          duration: 1,
          ease: 'power3.out'
        })
      }
    },
    [menu]
  )

  return (
    <button
      className={style.root}
      onMouseDown={openMenu}
      onMouseUp={closeMenu}
      onTouchStart={openMenu}
      onTouchEnd={closeMenu}
    >
      Menu
    </button>
  )
}
export default MenuTrigger
