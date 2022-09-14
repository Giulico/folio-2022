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

gsap.registerPlugin(ScrambleTextPlugin)
// type Props = {}

function Pointer() {
  const pointer = useSelector((state: RootState) => state.pointer)
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    // Scramble text
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        scrambleText: pointer.label,
        duration: 1
      })
    }
  }, [pointer.label])

  const classes = cn(style.root, {
    [style[`type-${pointer.type}`]]: pointer.type
  })

  return (
    <div className={classes} ref={cursorRef}>
      <span className={style.leftLine} />
      <span className={style.rightLine} />
      <span className={style.label} ref={labelRef} />
      <div className={style.hoverLeft} />
      <div className={style.hoverCenter} />
      <div className={style.hoverRight} />
    </div>
  )
}
export default Pointer
