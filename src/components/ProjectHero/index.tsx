// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useParams } from 'react-router-dom'
import useTransitionStage from 'hooks/useTransitionStage'
import { useTranslation } from 'react-i18next'

// COmponents
import Container from 'components/Container'

const ProjectHero = () => {
  const { project } = useParams()
  const ts = useTransitionStage()

  const { t } = useTranslation('translation')
  const { t: pt } = useTranslation('sketchin')

  const awards = pt('awards') as string[]

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container withoutMenu>
      <div className={classes}>
        <figure className={style.figure}>
          <img src={pt('image')} alt={project} />
        </figure>
        <div className={style.info}>
          <div className={style.titleContainer}>
            <div className={style.titleInner}>
              <h1 className={style.title}>{pt('title')}</h1>
            </div>
          </div>
          <div className={style.detailContainer}>
            <div className={style.details}>
              <div className={style.detailBlock}>
                <h3>{t('role')}</h3>
                <p>{pt('role')}</p>
              </div>
              <div className={style.detailBlock}>
                <h3>{t('agency')}</h3>
                <p>{pt('agency')}</p>
              </div>
              <div className={style.detailBlock}>
                <h3>{t('completed')}</h3>
                <p>{pt('completed')}</p>
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
              <a href={pt('live')} target="_blank">
                Visit live <img src="/icons/arrow-right.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProjectHero
