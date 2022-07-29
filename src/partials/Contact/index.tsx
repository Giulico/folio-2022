import style from './index.module.css'

// Components
import Section from 'components/Section'
import MenuItem from 'components/MenuItem'

function Contact() {
  return (
    <Section name="contact" className={style.root}>
      <MenuItem index={3} name="Contact" />
    </Section>
  )
}
export default Contact
