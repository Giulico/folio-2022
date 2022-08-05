import style from './index.module.css'

// Components
import Section from 'components/Section'
import MenuItem from 'components/MenuItem'
import Container from 'components/Container'

function Contact() {
  return (
    <Section name="contact" className={style.root}>
      <MenuItem index={3} name="Contact" />
      <Container right>
        <p>
          Get in touch to find out more about digital experiences to effectively reach and engage
          customers and target audiences.
        </p>
      </Container>
    </Section>
  )
}
export default Contact
