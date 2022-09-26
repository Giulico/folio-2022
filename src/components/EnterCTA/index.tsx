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
import { useRef, useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

gsap.registerPlugin(ScrambleTextPlugin)

const chars = '▲△◀∅∏▒▢◁≈▶▣▭'

const EnterCTA = () => {
  const { t } = useTranslation()

  const app = useSelector((state: RootState) => state.app)
  const [visible, setVisible] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLElement>(null)
  const dispatch = useDispatch()

  const clickHandler = useCallback(() => {
    if (!app.loaded) return
    dispatch.app.setReady()
  }, [app.loaded, dispatch.app])

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
          scrambleText: {
            text: t('enter'),
            chars
          },
          duration: 2
        })
        if (rings) {
          gsap.killTweensOf(rings, 'opacity')
          gsap.to(rings, {
            // rotation: 0,
            opacity: 0.5,
            duration: 0.5
          })
        }
      }
    }
  }, [app.loaded, t])

  const setHover = useCallback(() => {
    if (!app.loaded) return

    dispatch.pointer.setType('hover')
  }, [app.loaded, dispatch.pointer])

  const removeHover = useCallback(() => {
    if (!app.loaded) return

    dispatch.pointer.setType('')
  }, [app.loaded, dispatch.pointer])

  // Visible
  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 3000)
  }, [])

  const classes = cn(style.root, {
    [style.loaded]: app.loaded,
    [style.hidden]: app.ready || !visible
  })

  return (
    <div className={classes}>
      <button
        className={style.button}
        ref={buttonRef}
        onClick={clickHandler}
        onMouseEnter={app.loaded ? setHover : undefined}
        onMouseLeave={app.loaded ? removeHover : undefined}
      >
        <span className={style.ring} />
        <span className={style.ring} />
        <span className={style.ring} />
        <span className={style.ring} />
        <span className={style.ring} />
        <em className={style.label} ref={labelRef}>
          {t('loading')}
        </em>
      </button>
    </div>
  )
}

export default EnterCTA
