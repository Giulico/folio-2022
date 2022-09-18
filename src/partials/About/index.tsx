import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import ImageTrigger from 'components/ImageTrigger'
import Square from 'components/Square'
import Heading from 'components/Heading'
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
      <Container grid>
        <Row start={3} end={1}>
          <div className={style.section}>
            <ContentBlock key={intro[0]}>
              <div>
                <Trans
                  i18nKey={`about.intro.0`}
                  components={{
                    ImageVenice: <ImageTrigger name="venice" />,
                    ImageSketchin: <ImageTrigger name="sketchin" />,
                    ImageTCMGTK: <ImageTrigger name="tcmgtk" sizes={[2, 3]} />
                  }}
                />
              </div>
            </ContentBlock>
          </div>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={2}>
          <Heading key={intro[1]}>
            <Trans
              i18nKey="about.intro.1"
              components={{
                Square: <Square />,
                pre: <pre />
              }}
            />
          </Heading>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={1}>
          <ContentBlock key={intro[2]}>
            {intro.slice(2).map((txt, i) => (
              <div key={i}>
                <Trans
                  i18nKey={`about.intro.${i + 2}`}
                  components={{
                    ImageVenice: <ImageTrigger name="venice" />,
                    ImageSketchin: <ImageTrigger name="sketchin" />,
                    ImageTCMGTK: <ImageTrigger name="tcmgtk" sizes={[2, 3]} />
                  }}
                />
              </div>
            ))}
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={2} end={2}>
          <div className={style.section}>
            <Heading alignRight key={clanTitle[0]}>
              <>
                {clanTitle[0]}
                <br /> {clanTitle[1]}
              </>
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={2}>
          <div className={style.columns}>
            <ContentBlock key={clan[0]}>
              {clan.slice(0, 2).map((txt, i) => (
                <div key={i}>
                  <Trans
                    i18nKey={`about.clan.${i}`}
                    components={{
                      ImageBW: <ImageTrigger name="bw" sizes={[2.5, 2.5]} />,
                      ImageNO1: <ImageTrigger name="no1" />,
                      ImageNO2: <ImageTrigger name="no2" />,
                      ImageNO3: <ImageTrigger name="no3" sizes={[2, 2.5]} />
                    }}
                  />
                </div>
              ))}
            </ContentBlock>
            <ContentBlock key={clan[2]}>
              {clan.slice(2).map((txt, i) => (
                <div key={i}>
                  <Trans
                    i18nKey={`about.clan.${i + 2}`}
                    components={{
                      ImageBW: <ImageTrigger name="bw" sizes={[2.5, 2.5]} />,
                      ImageNO1: <ImageTrigger name="no1" />,
                      ImageNO2: <ImageTrigger name="no2" />,
                      ImageNO3: <ImageTrigger name="no3" sizes={[2, 2.5]} />
                    }}
                  />
                </div>
              ))}
            </ContentBlock>
          </div>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading key={methodTitle}>
              <Trans i18nKey="about.method_title" components={{ pre: <pre /> }} />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={1}>
          <ContentBlock key={method[0]}>
            <div>
              <Trans i18nKey={`about.method.0`} />
            </div>
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading key={method[1]}>
              <Trans i18nKey="about.method.1" />
            </Heading>
            <Heading alignRight key={method[2]}>
              <Trans i18nKey="about.method.2" />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={1} end={1}>
          <div className={style.section}>
            <ContentBlock key={method[3]}>
              <div>
                <Trans i18nKey={`about.method.3`} />
              </div>
            </ContentBlock>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={1} end={3}>
          <ContentBlock>
            <List>
              <ListItem end="x6">Awwwards</ListItem>
              <ListItem end="x6">CSS Design Awards</ListItem>
              <ListItem end="x1">FWA</ListItem>
              <ListItem end="x3">iF Design Award</ListItem>
              <ListItem end="x8">Other</ListItem>
            </List>
          </ContentBlock>
        </Row>
      </Container>
    </Section>
  )
}
export default About
