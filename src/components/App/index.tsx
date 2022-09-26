// Types
import type { RootState } from 'store'

// Utils
import { cursorPosition } from 'utils/events'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { primaryInput } from 'detect-it'

// Hooks
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useDebounce } from 'hooks/useDebounce'

// Components
import Pointer from 'components/Pointer'
import { ModalRoutes } from 'components/Router'
import Modal from 'components/Modal'
import ExperienceComponent from 'components/Experience'
import Hero from 'partials/Hero'
import Portfolio from 'partials/Portfolio'
import About from 'partials/About'
import Contact from 'partials/Contact'

window.cursor = {
  x: 0,
  y: 0
}
window.cursorNormalized = {
  x: 0,
  y: 0
}

function App() {
  const dispatch = useDispatch()

  const prevSizes = useRef({ height: 0, width: 0 })
  const appHeightTesterRef = useRef<HTMLDivElement>(null)

  const { scroll, sizes } = useSelector((state: RootState) => ({
    scroll: state.scroll,
    sizes: state.sizes
  }))

  const deviceHasPointer = useMemo(() => {
    return primaryInput === 'mouse'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes.width])

  const updateAppHeight = useDebounce(
    () => {
      if (!appHeightTesterRef.current) return

      const newWidth = appHeightTesterRef.current?.clientWidth
      const newHeight = appHeightTesterRef.current?.clientHeight

      const oldWidth = prevSizes.current.width
      const oldHeight = prevSizes.current.height

      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        // Save sizes to the store
        dispatch.sizes.update({
          width: newWidth,
          height: newHeight
        })

        // Save CSS Variable --app-height
        document.documentElement.style.setProperty('--app-height', `${newHeight}px`)

        // Update prevSizes
        prevSizes.current = {
          width: newWidth,
          height: newHeight
        }
      }
    },
    300,
    [sizes.width, sizes.height]
  )

  const updatePointerPosition = useCallback(
    (e: TouchEvent | MouseEvent) => {
      const { x, y } = cursorPosition(e)
      window.cursor.x = x
      window.cursor.y = y
      window.cursorNormalized.x = x / sizes.width - 0.5
      window.cursorNormalized.y = y / sizes.height - 0.5
    },
    [sizes.height, sizes.width]
  )

  useEffect(() => {
    updateAppHeight()

    window.addEventListener('resize', updateAppHeight)
    window.addEventListener('touchstart', updatePointerPosition)
    window.addEventListener('touchmove', updatePointerPosition)
    window.addEventListener('mousemove', updatePointerPosition)

    return () => {
      window.removeEventListener('resize', updateAppHeight)
      window.removeEventListener('touchstart', updatePointerPosition)
      window.removeEventListener('touchmove', updatePointerPosition)
      window.removeEventListener('mousemove', updatePointerPosition)
    }
  }, [dispatch.sizes, sizes.height, sizes.width, updateAppHeight, updatePointerPosition])

  useEffect(() => {
    if (scroll) {
      enablePageScroll()
    } else {
      disablePageScroll()
    }
  }, [scroll])

  return (
    <>
      <div
        ref={appHeightTesterRef}
        style={{ height: '100vh', width: '100%', pointerEvents: 'none', position: 'fixed' }}
      />
      <ExperienceComponent />
      <Hero />

      <Modal>
        <ModalRoutes />
      </Modal>

      <Portfolio />
      <About />
      <Contact />

      {deviceHasPointer && <Pointer />}
    </>
  )
}

export default App
