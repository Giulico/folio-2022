import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'
import breakpoints from 'utils/breakpoints'

// Hooks
import useScrollOffset from 'hooks/useScrollOffset'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

// Components
import Logo from 'components/Logo'
import Section from 'components/Section'
import AudioWave from 'components/AudioWave'
import Menu from 'components/Menu'
import EnterCTA from 'components/EnterCTA'
import LangSwitch from 'components/LangSwitch'
// import TextScramble, { ScrambleTexts } from 'components/TextScramble'
import GSAPScrumbleText, { ScrambleTexts } from 'components/GSAPScrumbleText'

export default function Hero() {
  const { t } = useTranslation('translation', { keyPrefix: 'intro' })
  const isTabletOrDesktop = useMediaQuery({ minWidth: breakpoints.mdP })

  const scrambleTexts: ScrambleTexts = [
    [t('p1.l1'), t('p1.l2')],
    [t('p2.l1'), t('p2.l2')],
    [t('p3.l1')],
    [t('p4.l1')]
  ]

  const { app, menu } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu
  }))

  const { gone } = useScrollOffset({ offset: isTabletOrDesktop ? 200 : 50 })

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
            <GSAPScrumbleText
              content={scrambleTexts}
              paused={!app.ready}
              key={scrambleTexts[0][0]}
            />
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
