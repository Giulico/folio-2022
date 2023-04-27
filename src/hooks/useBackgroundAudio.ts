// Types
import type { RootState } from 'store'

// Utils
import { Howl } from 'howler'

// Hooks
import { useEffect, useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

function useBackgroundAudio() {
  const audio = useRef<Howl | null>(null)
  const app = useSelector((state: RootState) => state.app)
  const [isPlaying, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    if (!audio.current) return

    const a = audio.current
    const isPlaying = a.playing()

    if (isPlaying) {
      a.fade(1, 0, 1000)
      a.once('fade', () => {
        a.stop()
        setPlaying(false)
      })
    } else {
      setPlaying(true)
      a.play()
      a.fade(0, 1, 1000)
    }
  }, [])

  useEffect(() => {
    audio.current = new Howl({
      src: ['/audio/background.mp3'],
      loop: true,
      volume: 0
    })
  }, [])

  useEffect(() => {
    if (app.ready && audio.current) {
      setPlaying(true)
      audio.current.play()
      audio.current.fade(0, 1, 3000)
    }
  }, [app.ready])

  return {
    toggle,
    isPlaying
  }
}

export default useBackgroundAudio
