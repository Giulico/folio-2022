// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import MenuItem from 'components/MenuItem'

function Portfolio() {
  return (
    <Section name="portfolio" className={style.root}>
      <div className={style.titleContainer}>
        <MenuItem index={1} name="Portfolio" />
      </div>
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
