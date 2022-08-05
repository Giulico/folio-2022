// Types
import type { RootState } from 'store'

// Utils
import { cursorPosition } from 'utils/events'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

// Hooks
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'

// Components
import { ModalRoutes } from 'components/Router'
import Modal from 'components/Modal'
import ExperienceComponent from 'components/Experience'
import LoadProgress from 'components/LoadProgress'
import Hero from 'partials/Hero'
import Portfolio from 'partials/Portfolio'
import About from 'partials/About'
import Contact from 'partials/Contact'

window.cursor = {
  x: 0,
  y: 0
}

function App() {
  const dispatch = useDispatch()
  const { scroll, sizes } = useSelector((state: RootState) => ({
    scroll: state.scroll,
    sizes: state.sizes
  }))

  const updateAppHeight = useCallback(() => {
    // Save sizes to the store
    dispatch.sizes.update({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Save CSS Variable --app-height
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
  }, [dispatch.sizes])

  const updatePointerPosition = useCallback(
    (e: TouchEvent | MouseEvent) => {
      const { x, y } = cursorPosition(e)
      window.cursor.x = x / sizes.width - 0.5
      window.cursor.y = y / sizes.height - 0.5
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
      <ExperienceComponent />
      <Hero />

      <Modal>
        <ModalRoutes />
      </Modal>

      <Portfolio />
      <About />
      <Contact />
      <LoadProgress />
    </>
  )
}

export default App
