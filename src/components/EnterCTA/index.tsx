// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
import cn from 'classnames'
import { randomIntFromInterval } from 'utils/math'

// Hooks
import { useRef, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

gsap.registerPlugin(ScrambleTextPlugin)

const EnterCTA = () => {
  const app = useSelector((state: RootState) => state.app)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLElement>(null)
  const dispatch = useDispatch()

  const clickHandler = useCallback(() => {
    dispatch.app.setReady()
  }, [dispatch.app])

  useEffect(() => {
    const rings = buttonRef.current?.querySelectorAll(`.${style.ring}`)
    if (rings) {
      for (const ring of rings) {
        const delay = randomIntFromInterval(1, 4)
        const rotateDuration = randomIntFromInterval(3, 8)
        gsap.to(ring, {
          opacity: 1,
          duration: 2,
          delay
        })
        gsap.to(ring, {
          rotation: 360,
          ease: 'none',
          duration: rotateDuration,
          repeat: -1,
          delay
        })
      }
    }
  }, [])

  useEffect(() => {
    if (app.loaded) {
      const rings = buttonRef.current?.querySelectorAll(`.${style.ring}`)
      if (rings) {
        gsap.to(labelRef.current, {
          scrambleText: 'Entra',
          duration: 2
        })
        if (rings) {
          gsap.killTweensOf(rings, 'rotation, opacity')
          gsap.to(rings, {
            rotation: 0,
            opacity: 0,
            duration: 0.5
          })
        }
      }
    }
  }, [app.loaded])

  const classes = cn(style.root, {
    [style.loaded]: app.loaded,
    [style.hidden]: app.ready
  })

  return (
    <div className={classes}>
      <button className={style.button} ref={buttonRef} onClick={clickHandler}>
        <span className={style.ring} />
        <span className={style.ring} />
        <span className={style.ring} />
        <span className={style.ring} />
        <span className={style.ring} />
        <em className={style.label} ref={labelRef}>
          Loading
        </em>
      </button>
    </div>
  )
}

export default EnterCTA
