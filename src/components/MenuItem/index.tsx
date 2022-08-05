// Types
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Animations
import { leaveTop, leaveBottom, enterTop, enterBottom } from './animations'

// Hooks
import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props = {
  name: string
  index: number
}

const MenuItem = ({ name, index }: Props) => {
  const dispatch = useDispatch()
  const menu = useSelector((state: RootState) => state.menu)

  const ref = useRef(null)
  const clipRef = useRef(null)
  const prevMenuIndex = useRef(menu.index)

  const letters = useMemo(
    () => name.split('').map((letter, index) => <span key={index}>{letter}</span>),
    [name]
  )

  useEffect(() => {
    dispatch.menu.addRef(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (menu.index === index && prevMenuIndex.current < index && clipRef.current) {
      enterTop(clipRef.current)
    }
    if (menu.index === index && prevMenuIndex.current > index && clipRef.current) {
      enterBottom(clipRef.current)
    }
    if (menu.index < index && prevMenuIndex.current === index && clipRef.current) {
      leaveTop(clipRef.current)
    }
    if (menu.index > index && prevMenuIndex.current === index && clipRef.current) {
      leaveBottom(clipRef.current)
    }

    // Update prevMenuIndex
    prevMenuIndex.current = menu.index
  }, [index, menu.index, menu.refs])

  useEffect(() => {
    // Leave clip when close menu
    if (!menu.open && menu.index === index && clipRef.current) {
      leaveTop(clipRef.current)
    }
  }, [index, menu.index, menu.open])

  return (
    <div className={style.root} ref={ref}>
      <div className={style.clipped} ref={clipRef}>
        {name}
      </div>
      <div className={style.outlined}>{letters}</div>
    </div>
  )
}
export default MenuItem
