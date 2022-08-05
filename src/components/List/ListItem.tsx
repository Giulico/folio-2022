import style from './index.module.css'

type Props = {
  children: string
  end: string
}

function ListItem({ children, end }: Props) {
  return (
    <div className={style.item}>
      <span>{children}</span>
      <span>{end}</span>
    </div>
  )
}

export default ListItem
