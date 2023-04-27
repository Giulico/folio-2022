import { useState, useCallback, useEffect } from 'react'

function useScrollOffset({ offset = 100 }) {
  const [gone, setGone] = useState(false)

  const scrollHandler = useCallback(() => {
    if (window.scrollY > offset && !gone) {
      setGone(true)
    }
    if (window.scrollY < offset && gone) {
      setGone(false)
    }
  }, [gone, offset])

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler, false)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [gone, scrollHandler])

  return {
    gone
  }
}

export default useScrollOffset
