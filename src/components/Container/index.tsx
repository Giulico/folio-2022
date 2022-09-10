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
  wide?: boolean
  children: ReactElement | ReactElement[]
}

const Container = ({ children, body, small, right, wide }: Props) => {
  const classes = cn(style.root, {
    [style.small]: small,
    [style.body]: body,
    [style.right]: right,
    [style.wide]: wide
  })

  return <div className={classes}>{children} </div>
}

export default Container
