import style from './index.module.css'

// Components
import Section from 'components/Section'
import MenuItem from 'components/MenuItem'

function About() {
  return (
    <Section name="about" className={style.root}>
      <MenuItem index={2} name="About" />
    </Section>
  )
}
export default About
