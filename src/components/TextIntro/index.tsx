// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import Container from 'components/Container'

// Hooks
import useTransitionStage from 'hooks/useTransitionStage'

type Props = {
  text: string
}

const TextIntro = ({ text }: Props) => {
  const ts = useTransitionStage()

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container small>
      <div className={classes}>
        <div className={style.inner}>{text}</div>
      </div>
    </Container>
  )
}

export default TextIntro
