import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import useScrollOffset from 'hooks/useScrollOffset'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// Components
import Logo from 'components/Logo'
import Section from 'components/Section'
import AudioWave from 'components/AudioWave'
import Menu from 'components/Menu'
import EnterCTA from 'components/EnterCTA'
import LangSwitch from 'components/LangSwitch'
import TextScramble, { ScrambleTexts } from 'components/TextScramble'

const scrambleTexts: ScrambleTexts = [
  ['Si tratta di tecnologia', 'e di processo di design'],
  ["La ricerca e l'innovazione", 'sono il driver per esperienze memorabili'],
  ['Sono un Creative Technologist'],
  ['They call me Giulio.']
]

export default function Hero() {
  const { t } = useTranslation()

  const { app, menu } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu
  }))

  const { gone } = useScrollOffset({ offset: 200 })

  const scrambleClasses = cn(style.scramble, {
    [style.gone]: gone || menu.open
  })

  const scrollClasses = cn(style.scroll, {
    [style.gone]: gone || menu.open || !app.ready
  })

  return (
    <>
      <header className={style.head}>
        <div className={style.logoContainer}>
          <Logo />
        </div>
        <div className={style.menuContainer}>
          <Menu />
        </div>
        <LangSwitch />
      </header>
      <Section name="hero" className={style.root}>
        <div className={style.middle}>
          <span className={style.line} />
          <div className={scrambleClasses}>
            {app.ready && (
              <TextScramble
                texts={scrambleTexts}
                dudClassName={style.dud}
                letterSpeed={40}
                nextLetterSpeed={100}
                pauseTime={2500}
                lineDelay={1000}
                loop={false}
              />
            )}
          </div>
        </div>

        <EnterCTA />

        <footer className={scrollClasses}>
          <span className={style.scrollIndicator} />
          <div>
            <span className={style.scrollText}>{t('scroll_cta.line1')}</span>
            <span className={style.scrollText}>{t('scroll_cta.line2')}</span>
          </div>
        </footer>
      </Section>
      <footer className={style.footer}>
        <AudioWave />
      </footer>
    </>
  )
}
