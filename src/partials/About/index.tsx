import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import ImageTrigger from 'components/ImageTrigger'
import { List, ListItem } from 'components/List'

// Hooks
import { Trans, useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation('translation', { keyPrefix: 'about' })
  const intro: string[] = t('intro', { returnObjects: true })
  const clanTitle: string = t('clan_title')
  const clan: string[] = t('clan', { returnObjects: true })
  const methodTitle: string = t('method_title')
  const method: string[] = t('method', { returnObjects: true })

  return (
    <Section name="about" className={style.root}>
      <Container right>
        <ContentBlock>
          {intro.map((txt, i) => (
            <p key={i}>
              <Trans
                i18nKey={`about.intro.${i}`}
                components={{
                  ImageVenice: <ImageTrigger name="venice" />,
                  ImageSketchin: <ImageTrigger name="sketchin" />,
                  ImageTCMGTK: <ImageTrigger name="tcmgtk" sizes={[2, 3]} />
                }}
              />
            </p>
          ))}
        </ContentBlock>
      </Container>
      <Container body>
        <h3>{clanTitle}</h3>
        <ContentBlock subtext>
          {clan.map((txt, i) => (
            <p key={i}>
              <Trans
                i18nKey={`about.clan.${i}`}
                components={{
                  ImageBW: <ImageTrigger name="bw" sizes={[2.5, 2.5]} />,
                  ImageNO1: <ImageTrigger name="no1" />,
                  ImageNO2: <ImageTrigger name="no2" />,
                  ImageNO3: <ImageTrigger name="no3" sizes={[2, 2.5]} />
                }}
              />
            </p>
          ))}
        </ContentBlock>
      </Container>
      <Container right>
        <h3 className={style.awardsTitle}>{methodTitle}</h3>
        <ContentBlock subtext>
          {method.map((txt, i) => (
            <p key={i}>
              <Trans
                i18nKey={`about.method.${i}`}
                components={{
                  ImageVenice: <ImageTrigger name="JPEG" />
                }}
              />
            </p>
          ))}
        </ContentBlock>
      </Container>
      <Container wide>
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
