import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'

// Hooks
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'

// Icons
import { ExternalArrow } from 'components/Icons'

function Contact() {
  const dispatch = useDispatch()

  const { t } = useTranslation('translation', { keyPrefix: 'contact' })
  const intro = t('intro')
  const socialIntro = t('social_intro')

  const { ref, inView } = useInView()

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  const emailClasses = cn({
    [style.isEmailVisible]: inView
  })

  return (
    <Section name="contact" className={style.root}>
      <Container grid>
        <Row start={1} end={1}>
          <ContentBlock key={intro}>
            <div>{intro}</div>
          </ContentBlock>
        </Row>
        <Row start={1} end={3}>
          <div
            className={style.section}
            ref={ref}
            onMouseEnter={overHandler}
            onMouseLeave={outHandler}
          >
            <Heading className={emailClasses}>
              <div>
                <div className={style.emailContainer}>
                  <a className={style.email} href="mailto:giuliocollesei@gmail.com">
                    giuliocollesei@gmail.com
                  </a>
                </div>
              </div>
            </Heading>
          </div>
        </Row>
        <Row start={1} end={1}>
          <ContentBlock key={socialIntro}>
            <div>{socialIntro}</div>
          </ContentBlock>
        </Row>
        <Row start={2} end={1}>
          <ContentBlock>
            <div>
              <ul className={style.list}>
                <li>
                  <a
                    href="https://www.linkedin.com/in/giuliocollesei/"
                    onMouseEnter={overHandler}
                    onMouseLeave={outHandler}
                    target="_blank"
                  >
                    Linkedin <ExternalArrow />
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/giuliocollesei"
                    onMouseEnter={overHandler}
                    onMouseLeave={outHandler}
                    target="_blank"
                  >
                    Twitter <ExternalArrow />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Giulico"
                    onMouseEnter={overHandler}
                    onMouseLeave={outHandler}
                    target="_blank"
                  >
                    Github <ExternalArrow />
                  </a>
                </li>
              </ul>
            </div>
          </ContentBlock>
        </Row>
      </Container>
    </Section>
  )
}
export default Contact
