import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import Container, { Row } from 'components/Container'

// Hooks
import { useTranslation } from 'react-i18next'
import useTransitionStage from 'hooks/useTransitionStage'

type Props = {
  awards: string[]
}

const images: { [keys: string]: string } = {
  awwwards: '/images/awwwards.jpg',
  'css design award': '/images/css-design-awards.jpg',
  'digital design awards': '/images/ddd.jpg',
  'if design awards': '/images/if.jpg',
  fwa: '/images/fwa.jpg'
}

function Award({ awards }: Props) {
  const { t } = useTranslation('translation')

  const ts = useTransitionStage()

  const classes = cn(style.root, ts && style[ts])

  return (
    <div className={classes}>
      <Container grid withoutMenu>
        <Row start={1} end={1}>
          <h3 className={style.title}>{t('riconoscimenti')}</h3>
        </Row>
        <Row start={2} end={2} className={style.container}>
          {awards.map((award) => (
            <figure className={style.figure} key={award}>
              <img src={images[award.toLowerCase()]} alt={award} title={award} />
              <figcaption>{award}</figcaption>
            </figure>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Award
