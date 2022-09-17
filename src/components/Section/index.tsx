// Types
import type { ReactNode } from 'react'
import type { RootState } from 'store'

// Hooks
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useCallback } from 'react'

type Props = {
  children: ReactNode
  name: string
  className?: string
  onEnter?: (boundary: RootState['section']['boundaries'][0]) => void
  onResize?: (boundary: RootState['section']['boundaries'][0]) => void
}

function Section({ children, name, className, onEnter, onResize }: Props) {
  const dispatch = useDispatch()

  const { scroll, section, sizes } = useSelector((state: RootState) => ({
    scroll: state.scroll,
    section: state.section,
    sizes: state.sizes
  }))

  const prevSizes = useRef(sizes)
  const ref = useRef<HTMLElement>(null)

  const setBoundary = useCallback(() => {
    if (scroll && ref.current) {
      dispatch.section.setBoundary({
        name,
        start: ref.current.offsetTop,
        end: ref.current.offsetTop + ref.current.offsetHeight
      })
    }
  }, [dispatch, name, scroll])

  // Initial boundary
  useEffect(setBoundary, [scroll])

  // Resize
  useEffect(() => {
    if (sizes.width !== prevSizes.current.width || sizes.height !== prevSizes.current.height) {
      setBoundary()
      const currentBoundary = section.boundaries.find((b) => b.name === name)
      if (currentBoundary) {
        onResize?.(currentBoundary)
      }
    }
  }, [sizes])

  const checkBoundary = useCallback(() => {
    const trigger = window.scrollY + sizes.height / 2
    const currentBoundary = section.boundaries.find((b) => b.name === name)
    if (
      section.current !== name && // change only if different
      currentBoundary && // typescript check
      trigger >= currentBoundary.start &&
      trigger < currentBoundary.end
    ) {
      dispatch.section.update(name)
      onEnter?.(currentBoundary)
    }
  }, [sizes, section, dispatch])

  useEffect(() => {
    window.addEventListener('scroll', checkBoundary)

    if (section.current !== 'portfolio') {
      dispatch.pointer.setType('default')
    }

    return () => {
      window.removeEventListener('scroll', checkBoundary)
    }
  }, [sizes, section, dispatch])

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  )
}

export default Section
