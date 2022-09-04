// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container from 'components/Container'
import ContentBlock from 'components/ContentBlock'

function Portfolio() {
  return (
    <Section name="portfolio" className={style.root}>
      <Container right>
        <ContentBlock>
          <p>
            At the moment this portfolio is my last project. It's made on top of React + Redux and
            Three.js.
          </p>
          <p>The code is written in Typescript and Glsl, and it's available on Github.</p>
          <p>Here is a selection of projects I was involved on</p>
        </ContentBlock>
      </Container>
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
