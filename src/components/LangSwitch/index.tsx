import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const languages = ['it', 'en']

const LangSwitch = () => {
  const { i18n } = useTranslation()

  const changeLanguage = useCallback(
    (lang: string) => () => {
      i18n.changeLanguage(lang)
    },
    [i18n]
  )

  return (
    <div className={style.root}>
      {languages.map((lang) => {
        const classes = cn(style.button, {
          [style.active]: lang === i18n.resolvedLanguage
        })

        return (
          <button key={lang} className={classes} onClick={changeLanguage(lang)}>
            {lang} <span className={style.marker} />
          </button>
        )
      })}
    </div>
  )
}
export default LangSwitch
