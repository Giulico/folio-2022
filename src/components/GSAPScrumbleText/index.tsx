// Style
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'

// Hooks
import { useEffect, useRef } from 'react'

export type ScrambleText = string[]

export type ScrambleTexts = ScrambleText[]

type Props = {
  paused: boolean
  content: ScrambleTexts
}

gsap.registerPlugin(ScrambleTextPlugin)

const chars = '▲△◀∅∏▒▢◁≈▶▣▭'

function GSAPScrumbleText({ content, paused }: Props) {
  const rootEl = useRef<HTMLDivElement>(null)
  const p1El = useRef<HTMLDivElement>(null)
  const p2El = useRef<HTMLDivElement>(null)
  const tl = useRef<GSAPTimeline | undefined>()

  useEffect(() => {
    if (tl.current) {
      tl.current.kill()
    }
    tl.current = gsap.timeline({ paused, delay: 4 })
    const delay = 1

    for (let i = 0; i < content.length; i++) {
      const l = content[i]
      tl.current.to(p1El.current, {
        duration: 1.5,
        delay,
        scrambleText: {
          text: l[0],
          chars,
          newClass: style.completed,
          tweenLength: false
        },
        onStart: () => {
          gsap.set(p1El.current, { opacity: 1 })
        }
      })

      if (l[1]) {
        tl.current.to(p2El.current, {
          duration: 1.5,
          scrambleText: {
            text: l[1],
            chars,
            newClass: style.completed,
            tweenLength: false
          },
          onStart: () => {
            gsap.set(p2El.current, { opacity: 1 })
          }
        })
      }

      if (i < content.length - 1) {
        tl.current.to([p1El.current, p2El.current], {
          opacity: 0,
          duration: 1.5,
          delay
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(content)])

  useEffect(() => {
    if (!tl.current) return

    if (!paused) {
      tl.current.play()
    }
  }, [paused])

  return (
    <div className={style.root} ref={rootEl}>
      <div className={style.phrase} ref={p1El}>
        &nbsp;
      </div>
      <div className={style.phrase} ref={p2El}>
        &nbsp;
      </div>
    </div>
  )
}
export default GSAPScrumbleText
