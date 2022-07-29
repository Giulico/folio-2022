import { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'
import { rootNavigate } from 'components/CustomRouter'

// Hooks
import useScrollOffset from 'hooks/useScrollOffset'
import { useSelector } from 'react-redux'

// Components
import Logo from 'components/Logo'
import Section from 'components/Section'
import AudioWave from 'components/AudioWave'
import MenuItem from 'components/MenuItem'
import MenuTrigger from 'components/MenuTrigger'
import TextScramble, { ScrambleTexts } from 'components/TextScramble'

const scrambleTexts: ScrambleTexts = [
  ['Hi'],
  ["I'm Giulio", 'a creative developer'],
  ["I've seen things", "you people wouldn't believe."],
  ['Attack ships on fire', 'off the shoulder of Orion.']
]

export default function Hero() {
  const { menu } = useSelector((state: RootState) => ({
    menu: state.menu
  }))

  const { gone } = useScrollOffset({ offset: 50 })

  const scrambleClasses = cn(style.scramble, {
    [style.gone]: gone || menu.open
  })

  const scrollClasses = cn(style.scroll, {
    [style.gone]: gone || menu.open
  })

  return (
    <>
      <header className={style.head}>
        <div className={style.logoContainer}>
          <Logo />
        </div>
        <div className={style.menuContainer}>
          <p className={style.desc}>35yo</p>
          <p className={style.desc}>Switzerland, Lugano</p>
          <hr className={style.separator} />
          <MenuTrigger />
          <br />
          <br />
          <br />
          <button
            onClick={() => {
              rootNavigate('/aquest')
            }}
          >
            Open modal
          </button>
        </div>
      </header>
      <Section name="hero" className={style.root}>
        <MenuItem index={0} name="TheyCallMeGiulio" />
        <div className={style.middle}>
          <span className={style.line} />
          <div className={scrambleClasses}>
            <TextScramble
              texts={scrambleTexts}
              dudClassName={style.dud}
              letterSpeed={40}
              nextLetterSpeed={100}
              pauseTime={2500}
              lineDelay={1000}
              loop={false}
            />
          </div>
        </div>
        <footer className={scrollClasses}>
          <span className={style.scrollIndicator} />
          <div>
            <p className={style.scrollText}>Scroll down</p>
            <p className={style.scrollText}>to see some works</p>
          </div>
        </footer>
      </Section>
      <footer className={style.footer}>
        <AudioWave />
      </footer>
    </>
  )
}
