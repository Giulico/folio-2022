// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import useTransitionStage from 'hooks/useTransitionStage'

// Components
import Container from 'components/Container'

type Props = {
  title: string
  text: string
}

const TextTwoColumns = ({ title, text }: Props) => {
  const ts = useTransitionStage()

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container small>
      <div className={classes}>
        <h3 className={style.title}>{title}</h3>
        <div className={style.text}>{text}</div>
      </div>
    </Container>
  )
}

export default TextTwoColumns
