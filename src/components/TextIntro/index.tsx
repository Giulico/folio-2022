// Style
import style from './index.module.css'

// Components
import Container from 'components/Container'

type Props = {
  text: string
}

const TextIntro = ({ text }: Props) => {
  return (
    <Container small>
      <div className={style.root}>{text}</div>
    </Container>
  )
}

export default TextIntro
