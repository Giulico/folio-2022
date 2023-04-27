// Types
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import { rootNavigate } from 'components/CustomRouter'
import cn from 'classnames'

// Components
import Container from 'components/Container'

// Hooks
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import { useRef, useMemo, useCallback, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useTransitionStage from 'hooks/useTransitionStage'

const radius = 70
const circumference = radius * 2 * Math.PI

const ProjectCTA = () => {
  const { t } = useTranslation('translation')

  const dispatch = useDispatch()
  const ts = useTransitionStage()

  const location = useLocation()
  const { project } = useParams()
  const projects = useSelector((state: RootState) => state.projects)

  const { ref, inView } = useInView()

  const timeout = useRef<number | null>(null)

  const nextProject = useMemo(() => {
    const currentIndex = projects.findIndex((p) => p.url === project)
    const nextIndex =
      currentIndex === -1 || currentIndex === projects.length - 1 ? 0 : currentIndex + 1
    return projects[nextIndex]
  }, [project, projects])

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  useEffect(() => {
    if (inView && !timeout.current) {
      timeout.current = window.setTimeout(() => {
        rootNavigate(nextProject.url)
        timeout.current = null
      }, 3000)
    }
    if (!inView && timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }, [inView, nextProject.url])

  useEffect(() => {
    if (location.pathname === '/' && timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }, [location.pathname])

  const classes = cn(style.root, ts && style[ts])

  return (
    <div className={classes}>
      <Container withoutMenu className={style.container}>
        {/* <div>&nbsp;</div>
        <button
          className={style.cta}
          onMouseEnter={overHandler}
          onMouseLeave={outHandler}
          onClick={() => rootNavigate('/')}
        >
          {t('close project')}
        </button> */}
        <button
          className={cn(style.cta, style.next)}
          onMouseEnter={overHandler}
          onMouseLeave={outHandler}
          onClick={() => rootNavigate(`/${nextProject.url}`)}
          ref={ref}
        >
          <div className={style.nextInner}>
            {t('go to project')} {nextProject.name}
            <div className={style.loader}>
              <svg width="150" height="150">
                <circle
                  stroke="#00f"
                  strokeWidth="2"
                  fill="transparent"
                  r="70"
                  cx="75"
                  cy="75"
                  style={{
                    strokeDasharray: `${circumference} ${circumference}`,
                    strokeDashoffset: inView ? 0 : circumference
                  }}
                />
              </svg>
            </div>
          </div>
        </button>
      </Container>
    </div>
  )
}

export default ProjectCTA
