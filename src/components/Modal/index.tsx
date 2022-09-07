// Types
import type { ReactElement } from 'react'
import type { Location } from 'history'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'
import { createContext } from 'react'
import { rootNavigate } from 'components/CustomRouter'

// Hooks
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState, useCallback } from 'react'

type ChildrenProps = {
  displayLocation: Location
  transitionStage: 'open' | 'close'
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
  const location = useLocation()
  const dispatch = useDispatch()
  const [displayLocation, setDisplayLocation] = useState<Location>(location)
  const [transitionStage, setTransitionStage] = useState<'open' | 'close'>(
    location.pathname === '/' ? 'close' : 'open'
  )

  const updateDisplayLocation = useCallback(() => {
    setDisplayLocation(location)
  }, [location])

  const openModal = useCallback(() => {
    setTransitionStage('open')
    dispatch.pointer.setType('default')
    dispatch.pointer.setLabel('')
    window.experience.world.portfolio?.openProjectAnimation()
  }, [dispatch.pointer])

  const closeModal = useCallback(() => {
    setTransitionStage('close')
    window.experience.world.portfolio?.closeProjectAnimation()
  }, [])

  useEffect(() => {
    // This is used in Portfolio.ts
    window.currentLocation = displayLocation
    window.comingLocation = location

    // Set the type of transition
    if (location !== displayLocation) {
      if (location.pathname === '/') {
        closeModal()
      } else {
        openModal()
      }
    }

    if (location.pathname !== '/') {
      setDisplayLocation(location)
    }
  }, [location, displayLocation, closeModal, openModal])

  const classes = cn(style.root, style[transitionStage])
  const buttonClasses = cn(style.backButton, style[transitionStage])

  return (
    <>
      <div className={classes} onAnimationEnd={updateDisplayLocation}>
        <div data-scroll-lock-scrollable className={style.contentContainer}>
          <div>
            <ModalContext.Provider value={{ displayLocation, transitionStage }}>
              {children}
            </ModalContext.Provider>
          </div>
        </div>
      </div>
      <button className={buttonClasses} onClick={() => rootNavigate('/')}>
        <figure>
          <img src="/icons/arrow-left.svg" />
        </figure>
        <span>Back</span>
      </button>
    </>
  )
}

export default Modal
