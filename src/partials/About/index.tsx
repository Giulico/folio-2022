import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import { List, ListItem } from 'components/List'

function About() {
  return (
    <Section name="about" className={style.root}>
      <Container body>
        <ContentBlock>
          <p>
            I have a solid experience in the design and development of architectures and interactive
            web applications as well as Design Systems. My preferred methodologies are those that
            are based on Lean and Agile principles. I incline towards these methodologies because
            they encourage the teamwork and decentralize the decision making processes.
          </p>
        </ContentBlock>
        <ContentBlock>
          <p>
            I pay close attention to the continuous improvement of the workflow. Furthermore, I
            adjust to a humble attitude and I prefer to empower rather than demand. I have daily
            interactions with developers, designers, IT managers and product owners.
          </p>
        </ContentBlock>
        <ContentBlock>
          <h4 className={style.awardsTitle}>Awards and Recognitions</h4>
        </ContentBlock>
        <ContentBlock reveal={false}>
          <List>
            <ListItem end="x6">Awwwards</ListItem>
            <ListItem end="x6">CSS Design Awards</ListItem>
            <ListItem end="x1">FWA</ListItem>
            <ListItem end="x3">iF Design Award</ListItem>
            <ListItem end="x8">Other</ListItem>
          </List>
        </ContentBlock>
      </Container>
    </Section>
  )
}
export default About
