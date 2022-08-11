// Hooks
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

// Utils
import { fontLoader } from 'utils/fonts'

// Settings
import { showExperience } from 'settings'

// Components
import Experience from './Experience'

function ExperienceComponent() {
  const experience = useRef<Experience>()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!showExperience) {
      fontLoader().then(() => {
        dispatch.app.setReady()
        dispatch.scroll.canScroll()
      })

      return
    }

    const canvas: HTMLCanvasElement | null = document.querySelector('canvas.webgl')
    if (!canvas) throw new Error('Failed to find the canvas element')

    experience.current = new Experience({
      targetElement: canvas
    })
  }, [])

  return <canvas className="webgl" />
}

export default ExperienceComponent
