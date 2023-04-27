// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import Container from 'components/Container'

// Hooks
import useTransitionStage from 'hooks/useTransitionStage'

type Media = {
  src: string
  alt: string
}

type Props = {
  media: Media[]
}

function Video({ src, alt }: Media) {
  return (
    <video muted loop autoPlay>
      <source src={src} type="video/mp4" />
      {alt}
    </video>
  )
}

function Media({ media }: Props) {
  const ts = useTransitionStage()

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container withoutMenu>
      <div className={classes}>
        {media.map(({ src, alt }, index) => {
          const isVideo = src.endsWith('.mp4')
          return (
            <div key={index} className={style.item}>
              {isVideo ? <Video key={src} src={src} alt={alt} /> : <img src={src} alt={alt} />}
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export default Media
