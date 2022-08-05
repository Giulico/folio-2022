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
}

const ProjectHero = ({ title, role, agency, image }: Props) => {
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
        <div>
          <h1 className={style.title}>{title}</h1>
          <div className={style.detailContainer}>
            <div>
              <h3>Role</h3>
              <p>{role}</p>
            </div>
            <div>
              <h3>Agency</h3>
              <p>{agency}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProjectHero
