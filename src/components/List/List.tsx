// Types
import type { ReactElement } from 'react'

// Style
import style from './index.module.css'

type Props = {
  children: ReactElement[]
}

function List({ children }: Props) {
  return <div className={style.root}>{children}</div>
}

export default List
