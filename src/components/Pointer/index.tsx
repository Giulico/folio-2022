// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
import cn from 'classnames'

// Hooks
import { useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

gsap.registerPlugin(ScrambleTextPlugin)
// type Props = {}

function Pointer() {
  const location = useLocation()
  const pointer = useSelector((state: RootState) => state.pointer)
  const cursorRef = useRef<HTMLDivElement>(null)

  const update = useCallback(() => {
    if (cursorRef.current) {
      gsap.set(cursorRef.current, {
        x: window.cursor.x,
        y: window.cursor.y
      })
    }

    requestAnimationFrame(update)
  }, [])

  useEffect(() => {
    update()
  }, [update])

  const classes = cn(style.root, {
    [style.dark]: location.pathname !== '/',
    [style[`type-${pointer.type}`]]: pointer.type
  })

  return (
    <div className={classes} ref={cursorRef}>
      <div className={style.leftLine} />
      <div className={style.rightLine} />
      <div className={style.circle} />
    </div>
  )
}
export default Pointer
