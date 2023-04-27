// Types
import type { RootState } from 'store'

// Utils
import { Howl } from 'howler'

// Hooks
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

function useVangelisAudio() {
  const howl = useRef<Howl | null>(null)
  const prevSection = useRef<string>('hero')
  const { audio, section } = useSelector((state: RootState) => ({
    audio: state.audio,
    section: state.section
  }))
  const currentSection = section.current

  useEffect(() => {
    howl.current = new Howl({
      src: ['/audio/vangelis.mp3'],
      volume: 0
    })
  }, [])

  useEffect(() => {
    if (!howl.current) return

    const a = howl.current
    if (audio.mute && a.playing()) {
      a.fade(1, 0, 1000)
      a.once('fade', () => {
        a.stop()
      })
    }
  }, [audio.mute])

  useEffect(() => {
    if (!howl.current) return

    const isPortfolio = currentSection === 'portfolio' && prevSection.current === 'hero'
    const isPlaying = howl.current.playing()
    const isMute = audio.mute

    if (isPortfolio && !isPlaying && !isMute) {
      howl.current.play()
      howl.current.fade(0, 1, 3000)
    }

    prevSection.current = currentSection
  }, [audio.mute, currentSection])
}

export default useVangelisAudio
