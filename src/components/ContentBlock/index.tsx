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
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useInView } from 'react-intersection-observer'

type Props = {
  children: ReactElement | ReactElement[]
  className?: string
  reveal?: boolean
}

gsap.registerPlugin(SplitText)

function ContentBlock({ children, reveal = true, className }: Props) {
  const frontRef = useRef<HTMLDivElement>(null)

  const { menu } = useSelector((state: RootState) => ({
    menu: state.menu
  }))

  const { ref, inView } = useInView()

  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })

  const classes = cn(style.root, {
    [style.isDesktop]: isDesktop,
    [style.isVisible]: isDesktop && inView,
    [style.menuOpen]: menu.open,
    [style.reveal]: reveal
  })

  const frontClasses = cn(style.front, className)
  const baseClasses = cn(style.base, className)

  return (
    <div className={classes} ref={ref}>
      {isDesktop && reveal && (
        <div ref={frontRef} className={frontClasses}>
          {children}
        </div>
      )}
      <div className={baseClasses}>{children}</div>
    </div>
  )
}

export default ContentBlock
