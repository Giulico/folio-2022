// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container from 'components/Container'
import ContentBlock from 'components/ContentBlock'

// Hooks
import { useTranslation } from 'react-i18next'

function Portfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'portfolio' })
  const intro: string[] = t('intro', { returnObjects: true })
  const portfolio: string[] = t('portfolio', { returnObjects: true })

  return (
    <Section name="portfolio" className={style.root}>
      <Container right>
        <ContentBlock>
          {intro.map((txt, i) => (
            <p key={i}>{txt}</p>
          ))}
        </ContentBlock>
      </Container>
      <Container body>
        <h3>Portfolio</h3>
        <ContentBlock subtext>
          {portfolio.map((txt, i) => (
            <p key={i}>{txt}</p>
          ))}
        </ContentBlock>
      </Container>

      <div className={style.cardContainer} id="card-container" />

      <video id="skReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/sk/sk-reel.mp4" type="video/mp4" />
      </video>
      <video id="aqReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/aq/reel-aq.mp4" type="video/mp4" />
      </video>
      <video id="fbReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/fb/fb-reel.mp4" type="video/mp4" />
      </video>
      <video id="feudiReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/feudi/feudi-reel.mp4" type="video/mp4" />
      </video>
      <video id="claralunaReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/claraluna/claraluna-reel.mp4" type="video/mp4" />
      </video>
    </Section>
  )
}
export default Portfolio
