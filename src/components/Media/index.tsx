// Style
import style from './index.module.css'

// Components
import Container from 'components/Container'

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
  return (
    <Container>
      <div className={style.root}>
        {media.map(({ src, alt }, index) => {
          const isVideo = src.endsWith('.mp4')
          return (
            <div key={index} className={style.item}>
              {isVideo ? <Video src={src} alt={alt} /> : <img src={src} alt={alt} />}
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export default Media
