// Types
import { ReactElement, useCallback } from 'react'
import type { Location } from 'history'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'
import { rootNavigate } from 'components/CustomRouter'

// Hooks
import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

type Props = {
  children: (displayLocation: Location) => ReactElement
}

const Modal = ({ children }: Props) => {
  const location = useLocation()
  const { project } = useParams()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('close')

  const updateDisplayLocation = useCallback(() => {
    setDisplayLocation(location)
  }, [location])

  const openModal = useCallback(() => {
    setTransitionStage('open')
    window.experience.world.portfolio?.openProjectAnimation()
  }, [])

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

  return (
    <div className={classes} onAnimationEnd={updateDisplayLocation}>
      <figure className={style.hero}>
        <img src="/projects/aq/hero.jpg" alt={project} />
      </figure>
      <div className={style.contentContainer}>
        <button className={style.backButton} onClick={() => rootNavigate('/')}>
          <img src="/icons/arrow-left.svg" /> Back
        </button>
        <div className={style.content}>{children(displayLocation)}</div>
      </div>
    </div>
  )
}

export default Modal
