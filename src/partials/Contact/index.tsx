import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'

function Contact() {
  return (
    <Section name="contact" className={style.root}>
      <Container grid>
        <Row start={3} end={1}>
          <ContentBlock>
            <p>
              Get in touch to find out more about digital experiences to effectively reach and
              engage customers and target audiences.
            </p>
          </ContentBlock>
        </Row>
      </Container>
    </Section>
  )
}
export default Contact
