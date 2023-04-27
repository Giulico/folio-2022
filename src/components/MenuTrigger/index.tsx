import React from 'react'

// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'
import { cursorPosition } from 'utils/events'
import breakpoints from 'utils/breakpoints'
import { gsap } from 'gsap'

// Hooks
import useMainMenu from 'hooks/useMainMenu'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import useHoverAudio from 'hooks/useHoverAudio'

const MenuTrigger = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const { app, menu, sizes } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu,
    sizes: state.sizes
  }))

  const [circleTop, setCircleTop] = useState<number>(0)
  const [endTop, setEndTop] = useState<number>(0)
  const [appLoading, setAppLoading] = useState<boolean>(true)

  const { play } = useHoverAudio(2)

  // Main Menu Effects
  const { isScrolling } = useMainMenu()

  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })
  const circleEl = useRef<HTMLDivElement>(null)
  const endEl = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(
    (event: MouseEvent | TouchEvent) => {
      window.removeEventListener('mouseup', closeMenu)
      window.removeEventListener('touchend', closeMenu)

      const eventType = isDesktop ? 'mouseup' : 'touchend'
      if (event.type !== eventType) return

      dispatch.menu.open(false)
      dispatch.pointer.setType('default')
    },
    [dispatch.menu, dispatch.pointer, isDesktop]
  )

  const openMenu = useCallback(
    (event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<HTMLButtonElement>) => {
      const eventType = isDesktop ? 'mousedown' : 'touchstart'
      if (isScrolling || event.type !== eventType) return

      dispatch.menu.open(true)
      dispatch.pointer.setType('hidden')

      window.addEventListener('mouseup', closeMenu)
      window.addEventListener('touchend', closeMenu)
    },
    [closeMenu, dispatch.menu, dispatch.pointer, isDesktop, isScrolling]
  )

  const syncYAxe = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!circleEl.current) return

      const { y: cursorY } = cursorPosition(e)
      // console.log(cursorY)
      const absCurrCircleT = cursorY - 25
      const currCircleT = cursorY - circleTop - 25

      let y = 0
      if (absCurrCircleT < circleTop) {
        y = 0
      } else if (absCurrCircleT > endTop) {
        y = endTop - circleTop
      } else {
        y = currCircleT
      }

      gsap.to(circleEl.current, {
        y,
        duration: 0.3
      })
    },
    [circleTop, endTop]
  )

  const overHandler = useCallback(() => {
    play()
    dispatch.pointer.setType('drag')
  }, [dispatch.pointer, play])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  useEffect(() => {
    if (menu.open) {
      window.addEventListener('mousemove', syncYAxe)
      window.addEventListener('touchmove', syncYAxe)
    } else {
      window.removeEventListener('mousemove', syncYAxe)
      window.removeEventListener('touchmove', syncYAxe)
      gsap.killTweensOf(circleEl.current)
      gsap.set(circleEl.current, { clearProps: 'all', delay: 0.5 })
    }
  }, [menu.open, syncYAxe])

  // Saving boundaries on app ready and on resize
  useEffect(() => {
    if (!app.ready) return

    if (circleEl.current) {
      requestAnimationFrame(() => {
        if (!circleEl.current || !endEl.current) return
        setCircleTop(circleEl.current.getBoundingClientRect().top)
        setEndTop(endEl.current.getBoundingClientRect().top)
      })
    }
  }, [app.ready, dispatch.menu, sizes.height])

  useEffect(() => {
    if (app.ready) {
      setTimeout(() => {
        setAppLoading(false)
      }, 1700)
    }
  }, [app.ready])

  const classes = cn(style.root, {
    [style.open]: menu.open,
    [style.notReady]: appLoading,
    [style.hidden]: location.pathname !== '/'
  })

  return (
    <div className={classes}>
      <button
        className={style.button}
        onMouseEnter={overHandler}
        onMouseLeave={outHandler}
        onMouseDown={openMenu}
        onTouchStart={openMenu}
      >
        <div className={style.circle} ref={circleEl}>
          Drop
        </div>

        <div className={style.labels}>
          <span className={style.labelMenu}>Menu</span>
          <span className={style.labelDrag}>Drag</span>
        </div>

        <div className={style.start}></div>
        <div className={style.line} />
        <div className={style.end} ref={endEl}></div>
      </button>
    </div>
  )
}
export default MenuTrigger
