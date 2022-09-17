// Style
import style from './index.module.css'

type Props = {
  children?: string
}

function OldBookParagraph({ children }: Props) {
  return <p className={style.root}>{children}</p>
}
export default OldBookParagraph
