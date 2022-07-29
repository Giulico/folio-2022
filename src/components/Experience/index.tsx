// Types
import type { RootState } from 'store'

// Utils
import { useSelector } from 'react-redux'

// Hooks
import { useEffect, useRef } from 'react'

// Components
import Experience from './Experience'

function ExperienceComponent() {
  const { current: currentSection } = useSelector((state: RootState) => state.section)
  const experience = useRef<Experience>()

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('canvas.webgl')
    if (!canvas) throw new Error('Failed to find the canvas element')

    experience.current = new Experience({
      targetElement: canvas
    })
  }, [])

  return <canvas className="webgl" />
}

export default ExperienceComponent
