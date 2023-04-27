// Types
import type { RootState } from 'store'

// Utils
import { Howl } from 'howler'

// Hooks
import { useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'

function useHoverAudio(n: number) {
  const howl = useRef<Howl | null>(null)
  const audio = useSelector((state: RootState) => state.audio)

  useEffect(() => {
    howl.current = new Howl({
      src: [`/audio/hover${n.toString()}.mp3`],
      volume: 1
    })
  }, [n])

  const play = useCallback(() => {
    if (!howl.current) return

    const isPlaying = howl.current.playing()
    const isMute = audio.mute

    if (!isPlaying && !isMute) {
      howl.current.play()
    }
  }, [audio.mute])

  return { play }
}

export default useHoverAudio
