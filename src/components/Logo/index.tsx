import style from './index.module.css'

function Logo() {
  return (
    <div className={style.root}>
      <span className={style.light}>They</span>
      <span className={style.light}>call me</span>
      <span className={style.bold}>Giulio</span>
    </div>
  )
}

export default Logo
