import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container from 'components/Container'
import ContentBlock from 'components/ContentBlock'

function Contact() {
  return (
    <Section name="contact" className={style.root}>
      <Container right>
        <ContentBlock>
          <p>
            Get in touch to find out more about digital experiences to effectively reach and engage
            customers and target audiences.
          </p>
        </ContentBlock>
      </Container>
    </Section>
  )
}
export default Contact
