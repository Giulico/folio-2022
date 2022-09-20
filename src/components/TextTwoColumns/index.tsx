// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import useTransitionStage from 'hooks/useTransitionStage'

// Components
import Container, { Row } from 'components/Container'

type Props = {
  title: string
  text: string
}

const TextTwoColumns = ({ title, text }: Props) => {
  const ts = useTransitionStage()

  const classes = cn(style.root, ts && style[ts])

  return (
    <div className={classes}>
      <Container grid withoutMenu>
        <Row start={1} end={1}>
          <h3 className={style.title}>{title}</h3>
        </Row>
        <Row start={2} end={2}>
          <div className={style.text} dangerouslySetInnerHTML={{ __html: text }} />
        </Row>
      </Container>
    </div>
  )
}

export default TextTwoColumns
