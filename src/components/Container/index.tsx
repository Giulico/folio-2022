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
  withoutMenu?: boolean
  children: ReactElement | ReactElement[]
  className?: string
}

type RowProps = {
  start?: number
  end?: number
  className?: string
  children: ReactElement | ReactElement[]
}

const Container = ({
  children,
  small,
  grid,
  className,
  withoutMenu,
  outerRightOnMobile
}: Props) => {
  const classes = cn(style.root, className, {
    [style.small]: small,
    [style.grid]: grid,
    [style.withoutMenu]: withoutMenu,
    [style.outerRightOnMobile]: outerRightOnMobile
  })

  return <div className={classes}>{children} </div>
}

export default Container

export function Row({ start = 1, end = 1, className, children }: RowProps) {
  return (
    <div
      className={cn(style.cell, className, {
        [style[`cell-start-${start}`]]: start,
        [style[`cell-end-${end}`]]: end
      })}
    >
      {children}
    </div>
  )
}
