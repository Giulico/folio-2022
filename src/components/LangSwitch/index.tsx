import style from './index.module.css'

// Utils
import cn from 'classnames'

const languages = ['it', 'en']

const LangSwitch = () => {
  return (
    <div className={style.root}>
      {languages.map((lang) => {
        const classes = cn(style.button, {
          [style.active]: lang === 'it'
        })

        return (
          <button key={lang} className={classes}>
            {lang} <span className={style.marker} />
          </button>
        )
      })}
    </div>
  )
}
export default LangSwitch
