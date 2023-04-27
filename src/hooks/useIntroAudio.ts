// Types
import type { RootState } from 'store'

// Utils
import { Howl } from 'howler'

// Hooks
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

function useBackgroundAudio() {
  const audio = useRef<Howl | null>(null)
  const app = useSelector((state: RootState) => state.app)

  useEffect(() => {
    audio.current = new Howl({
      src: ['/audio/intro.mp3'],
      volume: 0
    })
  }, [])

  useEffect(() => {
    if (app.ready && audio.current) {
      audio.current.play()
      audio.current.fade(0, 1, 3000)
    }
  }, [app.ready])
}

export default useBackgroundAudio
