// Types
import type { ReactElement } from 'react'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

type Props = {
  small?: boolean
  body?: boolean
  right?: boolean
  children: ReactElement | ReactElement[]
}

const Container = ({ children, body, small, right }: Props) => {
  const classes = cn(style.root, {
    [style.small]: small,
    [style.body]: body,
    [style.right]: right
  })

  return <div className={classes}>{children} </div>
}

export default Container
