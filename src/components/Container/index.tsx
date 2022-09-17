// Types
import type { ReactElement } from 'react'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

type Props = {
  small?: boolean
  grid?: boolean
  outerRightOnMobile?: boolean
  children: ReactElement | ReactElement[]
  className?: string
}

type RowProps = {
  start?: number
  end?: number
  children: ReactElement | ReactElement[]
}

const Container = ({ children, small, grid, className, outerRightOnMobile }: Props) => {
  const classes = cn(style.root, className, {
    [style.small]: small,
    [style.grid]: grid,
    [style.outerRightOnMobile]: outerRightOnMobile
  })

  return <div className={classes}>{children} </div>
}

export default Container

export function Row({ start = 1, end = 1, children }: RowProps) {
  return (
    <div
      className={cn(style.cell, {
        [style[`cell-start-${start}`]]: start,
        [style[`cell-end-${end}`]]: end
      })}
    >
      {children}
    </div>
  )
}
