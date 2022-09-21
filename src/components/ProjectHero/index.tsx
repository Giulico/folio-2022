// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useTransitionStage from 'hooks/useTransitionStage'
import { useTranslation } from 'react-i18next'

// COmponents
import Container from 'components/Container'

// Icons
import { ExternalArrow } from 'components/Icons'

const ProjectHero = () => {
  const dispatch = useDispatch()

  // const { project } = useParams()
  const ts = useTransitionStage()

  // const { t } = useTranslation('translation')
  // const { t: pt } = useTranslation(project)

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  const awards = ['Awww'] // pt('awards') as string[]

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container withoutMenu>
      <div className={classes}>
        <figure className={style.figure}>{/* <img src={pt('image')} alt={project} /> */}</figure>
        <div className={style.info}>
          <div className={style.titleContainer}>
            <div className={style.titleInner}>
              <h1 className={style.title}>il mio titolo</h1>
            </div>
          </div>
          <div className={style.detailContainer}>
            <div className={style.details}>
              <div className={style.detailBlock}>
                <h3>Role</h3>
                <p>Il mio ruolo</p>
              </div>
              <div className={style.detailBlock}>
                <h3>Agency</h3>
                <p>La mia agenzia</p>
              </div>
              <div className={style.detailBlock}>
                <h3>Completed</h3>
                <p>Scegli una data</p>
              </div>
              <div className={style.detailBlock}>
                {awards && (
                  <>
                    <h3>Awards</h3>
                    {awards.map((a) => (
                      <p key={a}>{a}</p>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className={style.live}>
              <a
                href={'https://www.google.com'}
                target="_blank"
                onMouseEnter={overHandler}
                onMouseLeave={outHandler}
              >
                {/* Visit live <img src="/icons/arrow-right.svg" /> */}
                Visit live{' '}
                <span className={style.externalArrow}>
                  <ExternalArrow />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProjectHero
