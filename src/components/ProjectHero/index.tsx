// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useTransitionStage from 'hooks/useTransitionStage'

// COmponents
import Container from 'components/Container'

type Props = {
  title: string
  role: string
  agency: string
  image: string
  completed: string
  awards: string[]
  live: string
}

const ProjectHero = ({ title, role, agency, completed, awards, live, image }: Props) => {
  const { project } = useParams()
  const [ts, setTs] = useState<'open' | 'close'>()
  const transitionStage = useTransitionStage()

  useEffect(() => {
    requestAnimationFrame(() => {
      setTs(transitionStage)
    })
  }, [transitionStage])

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container>
      <div className={classes}>
        <figure className={style.figure}>
          <img src={image} alt={project} />
        </figure>
        <div className={style.info}>
          <div className={style.titleContainer}>
            <h1 className={style.title}>{title}</h1>
          </div>
          <div className={style.detailContainer}>
            <div className={style.details}>
              <div>
                <h3>Role</h3>
                <p>{role}</p>
              </div>
              <div>
                <h3>Agency</h3>
                <p>{agency}</p>
              </div>
              <div>
                <h3>Completed</h3>
                <p>{completed}</p>
              </div>
              <div>
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
              <a href={live} target="_blank">
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
