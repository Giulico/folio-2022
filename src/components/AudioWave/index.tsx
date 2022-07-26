import style from './index.module.css'

function AudioWave() {
  return (
    <div className={style.wave}>
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
    </div>
  )
}

export default AudioWave
