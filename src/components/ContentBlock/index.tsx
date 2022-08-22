import type { ReactElement } from 'react'
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useSelector } from 'react-redux'

type Props = {
  children: ReactElement
}

function ContentBlock({ children }: Props) {
  const menu = useSelector((state: RootState) => state.menu)

  const classes = cn(style.root, {
    [style.menuOpen]: menu.open
  })

  return <div className={classes}>{children}</div>
}

export default ContentBlock
