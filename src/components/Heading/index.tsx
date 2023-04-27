// Types
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
import useTextFit from 'hooks/useTextFit'
import { useMediaQuery } from 'react-responsive'
import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'

type Props = {
  children?: ReactElement | string
  alignRight?: boolean
  misaligned?: boolean
  className?: string
}

gsap.registerPlugin(SplitText)

function Heading({ children, alignRight, misaligned, className }: Props) {
  const { scroll, menu, sizes } = useSelector((state: RootState) => ({
    menu: state.menu,
    scroll: state.scroll,
    sizes: state.sizes
  }))

  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })
  const { ref, inView } = useInView()

  const ref1 = useRef<HTMLDivElement>(null)
  const splitText = useRef<SplitText | null>(null)

  useTextFit(ref1)

  const splitChars = useCallback(() => {
    // debugger
    // Restore splitted text
    if (splitText.current) {
      splitText.current.revert()
    }
    // New split text
    const elements = ref1.current?.querySelectorAll('.textFitted')
    if (elements) {
      splitText.current = new SplitText(elements, {
        type: 'lines,chars',
        linesClass: `${style.line}`,
        charsClass: `${style.char}`
      })
    }
  }, [])

  useEffect(() => {
    if (scroll && isDesktop) {
      splitChars()
    }
  }, [scroll, isDesktop, splitChars, sizes.width])

  useEffect(() => {
    // It it was desktop, but user resizes to mobile
    if (!isDesktop && splitText.current) {
      splitText.current.revert()
    }
  }, [isDesktop])

  const classes = cn(style.root, className, {
    [style.alignRight]: alignRight,
    [style.misaligned]: misaligned,
    [style.isVisible]: isDesktop && inView,
    [style.menuOpen]: menu.open
  })

  return (
    <div ref={ref}>
      <div ref={ref1} className={classes}>
        {children}
      </div>
    </div>
  )
}
export default Heading
