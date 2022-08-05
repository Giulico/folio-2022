// Style
import style from './index.module.css'

// Components
import Container from 'components/Container'

type Props = {
  title: string
  text: string
}

const TextTwoColumns = ({ title, text }: Props) => {
  return (
    <Container small>
      <div className={style.root}>
        <h3 className={style.title}>{title}</h3>
        <div className={style.text}>{text}</div>
      </div>
    </Container>
  )
}

export default TextTwoColumns
