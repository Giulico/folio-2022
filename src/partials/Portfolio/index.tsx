// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'
import { Trans } from 'react-i18next'

// Hooks
import { useTranslation } from 'react-i18next'

function Portfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'portfolio' })
  const intro: string[] = t('intro', { returnObjects: true })
  const portfolio: string[] = t('portfolio', { returnObjects: true })

  return (
    <Section name="portfolio" className={style.root}>
      <Container grid outerRightOnMobile>
        <Row start={1} end={2}>
          <Heading misaligned key={intro[0]}>
            <>
              <pre className={style.pre}>{intro[0]}</pre>
              <Trans i18nKey="portfolio.intro.1" />
            </>
          </Heading>
        </Row>
      </Container>
      <Container grid key={intro[2]}>
        <Row start={3} end={1}>
          <ContentBlock>
            <div>{intro[2]}</div>
            <div>{intro[3]}</div>
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile className={style.projectSection}>
        <Row start={2} end={2}>
          <Heading key={portfolio[0]}>{portfolio[0]}</Heading>
        </Row>
      </Container>
      <Container grid key={portfolio[1]}>
        <Row start={2} end={1}>
          <ContentBlock>
            <div>
              <Trans i18nKey="portfolio.portfolio.1" />
              <Trans i18nKey="portfolio.portfolio.2" />
            </div>
          </ContentBlock>
        </Row>
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
