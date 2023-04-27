// Types
import type { ReactElement } from 'react'
import type { Location } from 'history'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'
import { gsap } from 'gsap'
import { createContext } from 'react'
import { rootNavigate } from 'components/CustomRouter'

// Hooks
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type ChildrenProps = {
  displayLocation: Location
  transitionStage: 'open' | 'close' | 'transitionOut'
}

type Props = {
  children: ReactElement // (props: ChildrenProps) => ReactElement
}

export const ModalContext = createContext<ChildrenProps>({
  transitionStage: 'close',
  displayLocation: {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
  }
})

const Modal = ({ children }: Props) => {
  const { t } = useTranslation('translation')

  const location = useLocation()

  const dispatch = useDispatch()

  const containerEl = useRef<HTMLDivElement>(null)

  const [displayLocation, setDisplayLocation] = useState<Location>(location)
  const [transitionStage, setTransitionStage] = useState<'open' | 'close' | 'transitionOut'>(
    location.pathname === '/' ? 'close' : 'open'
  )

  const updateDisplayLocation = useCallback(() => {
    setDisplayLocation(location)
  }, [location])

  const openModal = useCallback(() => {
    setTransitionStage('open')
    dispatch.pointer.setType('default')
    window.experience.world.portfolio?.openProjectAnimation()
  }, [dispatch.pointer])

  const closeModal = useCallback(() => {
    setTransitionStage('close')
    window.experience.world.portfolio?.closeProjectAnimation()
  }, [])

  const transitionModal = useCallback(() => {
    // Closing window.currentLocation lauch
    window.experience.world.portfolio?.closeProjectAnimation()
    // Open window.comingLocation launch
    window.experience.world.portfolio?.openProjectAnimation()

    setTransitionStage('transitionOut')
    gsap.delayedCall(1.3, () => {
      if (containerEl.current) {
        containerEl.current.scroll(0, 0)
      }
      updateDisplayLocation()
      setTransitionStage('open')
    })
  }, [updateDisplayLocation])

  useEffect(() => {
    // These are used in Portfolio.ts
    window.currentLocation = displayLocation
    window.comingLocation = location

    // Set the type of transition
    if (location !== displayLocation) {
      if (location.pathname === '/') {
        closeModal()
      } else if (location.pathname !== '/' && displayLocation.pathname !== '/') {
        transitionModal()
      } else {
        openModal()
        // Se è un progetto setta subito
        setDisplayLocation(location)
      }
    }
  }, [location, displayLocation, closeModal, openModal, transitionModal])

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  const classes = cn(style.root, style[transitionStage])
  const buttonClasses = cn(style.backButton, style[transitionStage])

  return (
    <>
      <div className={classes} onAnimationEnd={updateDisplayLocation}>
        <div data-scroll-lock-scrollable className={style.contentContainer} ref={containerEl}>
          <div>
            <ModalContext.Provider value={{ displayLocation, transitionStage }}>
              {children}
            </ModalContext.Provider>
          </div>
        </div>
      </div>
      <button
        className={buttonClasses}
        onClick={() => rootNavigate('/')}
        onMouseEnter={overHandler}
        onMouseLeave={outHandler}
      >
        <figure>
          <img src="/icons/arrow-left.svg" />
        </figure>
        <span>{t('close')}</span>
      </button>
    </>
  )
}

export default Modal
