// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const languages = ['it', 'en']

const LangSwitch = () => {
  const dispatch = useDispatch()
  const { app, menu } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu
  }))
  const [isReady, setIsReady] = useState(false)
  const { i18n } = useTranslation()
  const location = useLocation()

  const changeLanguage = useCallback(
    (lang: string) => () => {
      i18n.changeLanguage(lang)
    },
    [i18n]
  )

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  useEffect(() => {
    if (app.ready) {
      setTimeout(() => {
        setIsReady(true)
      }, 3500)
    }
  }, [app.ready])

  const isHome = location.pathname === '/'

  const classes = cn(style.root, {
    [style.hidden]: !isReady || menu.open,
    [style.dark]: !isHome
  })

  return (
    <div className={classes}>
      {languages.map((lang) => {
        const isActive = lang === i18n.resolvedLanguage
        const classes = cn(style.button, {
          [style.active]: isActive
        })

        return (
          <button
            key={lang}
            className={classes}
            onClick={changeLanguage(lang)}
            onMouseEnter={isActive ? undefined : overHandler}
            onMouseLeave={outHandler}
          >
            <span className={style.label}>
              <span>{lang}</span>
            </span>
            <span className={style.marker} />
          </button>
        )
      })}
    </div>
  )
}
export default LangSwitch
