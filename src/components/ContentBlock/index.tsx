import type { ReactElement } from 'react'
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'
import breakpoints from 'utils/breakpoints'
import { gsap } from 'gsap'
import SplitText from 'gsap/SplitText'

// Hooks
import { useRef, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useInView } from 'react-intersection-observer'

type Props = {
  children: ReactElement | ReactElement[]
  reveal?: boolean
}

gsap.registerPlugin(SplitText)

function ContentBlock({ children, reveal = true }: Props) {
  const frontRef = useRef<HTMLDivElement>(null)
  const splitText = useRef<SplitText | null>(null)
  const { scroll, menu, sizes } = useSelector((state: RootState) => ({
    scroll: state.scroll,
    menu: state.menu,
    sizes: state.sizes
  }))
  const { ref, inView } = useInView()

  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })

  const splitLines = useCallback(() => {
    // debugger
    // Restore splitted text
    if (splitText.current && typeof splitText.current.revert === 'function') {
      splitText.current.revert()
    }
    // New split text
    const elements = frontRef.current?.querySelectorAll('p')
    if (elements) {
      splitText.current = new SplitText(elements, {
        type: 'lines',
        linesClass: `${style.line}`
      })
      splitText.current.lines.forEach((line, index) => {
        line.classList.add(style[`line-${index + 1}`])
      })
    }
  }, [])

  useEffect(() => {
    if (scroll && isDesktop && reveal) {
      splitLines()
    }
  }, [scroll, isDesktop, splitLines, reveal, sizes.width])

  const classes = cn(style.root, {
    [style.isDesktop]: isDesktop,
    [style.isVisible]: isDesktop && inView,
    [style.menuOpen]: menu.open,
    [style.reveal]: reveal
  })

  return (
    <div className={classes} ref={ref}>
      {isDesktop && reveal && (
        <div ref={frontRef} className={style.front}>
          {children}
        </div>
      )}
      <div className={style.base}>{children}</div>
    </div>
  )
}

export default ContentBlock
